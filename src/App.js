import logo from "./logo.svg";
import "./App.scss";
import {
  createPullUpBar,
  deletePullUpBar,
  updatePullUpBar,
} from "./graphql/mutations";
import { listPullUpBarsByUserByDate } from "./customQueries";
import { getPullUpBar } from "./graphql/queries";
import { Amplify, API, Storage } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Popup from "./components/Popup/Popup";
import "@aws-amplify/ui-react/styles.css";
import makeid from "./utils/randomString";

Amplify.configure(awsExports);

const initialData = {
  id: "",
  name: "",
  description: "",
  files: [],
  loadedFiles: [],
  index: 0,
};

function App({ signOut, user }) {
  const [pullUpBarList, setPullUpBarList] = useState();
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getAllPullUpBars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setPopupVisible(false);
    setIsUpdating(false);
    setFormData(initialData);
  };

  async function addPullUpBar(name, description, files) {
    try {
      const fileArray = [];
      if (Array.isArray(files)) {
        for (const file of files) {
          const uniqueId = makeid(24);
          await Storage.put(uniqueId, file, {
            contentType: "image/png",
          }).then((response) => {
            const fileId = response.key;
            fileArray.push(fileId);
          });
        }
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
            type: "PullUpBar",
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
        query: listPullUpBarsByUserByDate,
        variables: {
          userID: user.username,
        },
      });

      const pullUpBars = response.data?.PullUpBarsByDate?.items;

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
    const imageObjectArray = [];
    for (const id of idArray) {
      try {
        const response = await Storage.get(id);
        imageObjectArray.push({ id: id, url: response });
      } catch (error) {
        // Handle errors if an image cannot be fetched
        console.error("Error fetching image:", error);
      }
    }
    return imageObjectArray;
  }

  async function removePullUpBar(id) {
    try {
      await API.graphql({
        query: deletePullUpBar,
        variables: {
          input: { id: id },
        },
      }).then((response) => {
        const imagesToDelete = response.data.deletePullUpBar.images;
        imagesToDelete.forEach(async (image) => {
          await Storage.remove(image);
        });
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

  const handleSubmitAdd = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    addPullUpBar(formData.name, formData.description, formData.files);
    setPopupVisible(false);
    setFormData(initialData);
  };

  async function handleEdit(id, index) {
    try {
      await API.graphql({
        query: getPullUpBar,
        variables: { id: id },
      }).then(async (response) => {
        const imagesLinks = await getAllPullUpLinks(
          response.data.getPullUpBar.images
        );
        setPopupVisible(true);
        setIsUpdating(true);
        setFormData((prev) => {
          return {
            ...prev,
            name: response.data.getPullUpBar.name,
            description: response.data.getPullUpBar.description,
            id: response.data.getPullUpBar.id,
            index: index,
            loadedFiles: imagesLinks,
          };
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const fileArray = [];
      if (Array.isArray(formData.files)) {
        for (const file of formData.files) {
          const uniqueId = makeid(24);
          await Storage.put(uniqueId, file, {
            contentType: "image/png",
          }).then((response) => {
            const fileId = response.key;
            fileArray.push(fileId);
          });
        }
      }

      API.graphql({
        query: updatePullUpBar,
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            id: formData.id,
            images: [
              ...pullUpBarList[formData.index].images.map((item) => item.id),
              ...fileArray,
            ],
          },
        },
      }).then(async (response) => {
        const imagesLinks = await getAllPullUpLinks(
          response.data.updatePullUpBar.images
        );

        setPullUpBarList((prev) => {
          return [
            ...prev.slice(0, formData.index),
            { ...response.data.updatePullUpBar, images: imagesLinks },
            ...prev.slice(formData.index + 1),
          ];
        });

        resetForm();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const files = Object.values(e.target.files);
    setFormData({
      ...formData,
      files: files,
    });
  };

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
              pullUpBarList.map((x, index) => {
                return (
                  <li key={x.id}>
                    {x.name} - {x.description}
                    <button
                      onClick={() => {
                        removePullUpBar(x.id);
                      }}
                    >
                      X
                    </button>
                    <button
                      onClick={() => {
                        handleEdit(x.id, index);
                      }}
                    >
                      Edit
                    </button>
                    {x.images?.map((image) => {
                      return (
                        <img
                          key={image.id}
                          width={"50px"}
                          style={{ border: "2px solid black", margin: "2px" }}
                          src={image.url}
                          alt={"not available"}
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
              resetForm();
            }}
            renderContent={() => {
              return (
                <form onSubmit={isUpdating ? handleUpdate : handleSubmitAdd}>
                  <input
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    type="text"
                    placeholder="Name"
                    name="name"
                  />
                  <input
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    type="text"
                    placeholder="Description"
                    name="description"
                  />
                  <input
                    multiple
                    type={"file"}
                    name={"input-name"}
                    onChange={handleFileUpload}
                  />
                  <div>
                    {formData.loadedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{ display: "inline-block", margin: "5px" }}
                      >
                        <img
                          src={file.url}
                          alt={`preview-${index}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            border: "1px solid",
                          }}
                          //Todo
                          // onClick={() => clearLoadedInputValue(index)}
                        />
                      </div>
                    ))}
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        style={{ display: "inline-block", margin: "5px" }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            border: "1px solid",
                          }}
                          //Todo
                          // onClick={() => clearInputValue(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit">{isUpdating ? "Update" : "Add"}</button>
                </form>
              );
            }}
          />
          <a href={`/`}>Home</a>
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(App);
