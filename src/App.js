import logo from "./logo.svg";
import "./App.scss";
import { createPullUpBar, deletePullUpBar } from "./graphql/mutations";
import { listPullUpBarsByUser } from "./customQueries";
import { Amplify, API, Storage } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useRef, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Popup from "./components/Popup/Popup";
import "@aws-amplify/ui-react/styles.css";
import makeid from "./utils/randomString";

Amplify.configure(awsExports);

const initialData = {
  name: "",
  description: "",
  userId: "",
  file: null,
};

function App({ signOut, user }) {
  const [pullUpBarList, setPullUpBarList] = useState();
  const [formData, setFormData] = useState(initialData);
  const formRef = useRef();
  const [popupVisible, setPopupVisible] = useState(false);

  async function addPullUpBar(name, description, files) {
    try {
      const fileArray = [];

      for (const file of files) {
        const uniqueId = makeid(12);
        await Storage.put(`${uniqueId}-${user.username}`, file, {
          contentType: "image/png",
        }).then((response) => {
          const fileId = response.key.slice(0, 12);
          fileArray.push(fileId);
        });
      }

      // Use Promise.all to fetch all image links
      const images = await getAllPullUpLinks(fileArray);

      await API.graphql({
        query: createPullUpBar,
        variables: {
          input: {
            name: name,
            description: description,
            userID: user.username,
            images: fileArray,
          },
        },
      }).then((result) => {
        const createdPullUpBar = result.data.createPullUpBar;

        // Combine the created pull-up bar with its image links
        createdPullUpBar.images = images;

        setPullUpBarList((prev) => [createdPullUpBar, ...prev]);
      });

      // Handle the results as needed
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getAllPullUpBars() {
    try {
      const response = await API.graphql({
        query: listPullUpBarsByUser(user.username),
      });

      const pullUpBars = response.data?.listPullUpBars?.items;

      // Use Promise.all to fetch all images concurrently
      const updatedPullUpBars = await Promise.all(
        pullUpBars.map(async (x) => {
          x.images = await getAllPullUpLinks(x.images);
          return x;
        })
      );

      setPullUpBarList(updatedPullUpBars);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  }

  async function getAllPullUpLinks(idArray) {
    const linkArray = [];
    for (const id of idArray) {
      try {
        const response = await Storage.get(`${id}-${user.username}`);
        linkArray.push(response);
      } catch (error) {
        // Handle errors if an image cannot be fetched
        console.error("Error fetching image:", error);
      }
    }
    return linkArray;
  }

  useEffect(() => {
    getAllPullUpBars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function removePullUpBar(id) {
    try {
      await API.graphql({
        query: deletePullUpBar,
        variables: {
          input: { id: id },
        },
      }).then((response) => {
        setPullUpBarList((prev) => {
          return prev.filter((x) => {
            return x?.id !== response?.data?.deletePullUpBar?.id;
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    formRef.current?.reset();
    addPullUpBar(formData.name, formData.description, formData.file);
    setFormData(initialData);
    setPopupVisible(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleUpload(e) {
    const file = Object.values(e.target.files);
    // const file =(e.target.files)

    setFormData({
      ...formData,
      file: file,
    });
  }

  return (
    <>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>Hello {user?.attributes?.name}</h1>
        <button onClick={signOut}>Sign out</button>

        <div className="App-body">
          <button onClick={() => setPopupVisible(true)}>
            Add new Pull Up bar
          </button>
          <ul id="listContainer">
            {pullUpBarList &&
              pullUpBarList.map((x) => {
                return (
                  <li key={x.id}>
                    {x.name} - {x.description}{" "}
                    <button
                      onClick={() => {
                        removePullUpBar(x.id);
                      }}
                    >
                      X
                    </button>
                    {x.images?.map((image) => {
                      return (
                        <img
                          key={image}
                          width={"50px"}
                          style={{ border: "2px solid black", margin: "2px" }}
                          src={image}
                          alt={"nope.."}
                        />
                      );
                    })}
                  </li>
                );
              })}
          </ul>

          <Popup
            display={popupVisible}
            popupButtonText={"Cancel"}
            handleOkButtonClick={() => {
              setPopupVisible(false);
            }}
            renderContent={() => {
              return (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Description"
                    name="description"
                    onChange={handleInputChange}
                  />
                  {/* ToDo: File uploads to S3 storage */}
                  <input
                    required
                    multiple
                    onChange={handleUpload}
                    type={"file"}
                  />

                  <button type="submit">Submit</button>
                </form>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(App);
