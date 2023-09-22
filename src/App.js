import logo from "./logo.svg";
import "./App.scss";
import { createPullUpBar, deletePullUpBar } from "./graphql/mutations";
import { listPullUpBarsByUser } from "./customQueries";
import { Amplify, API } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useRef, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Popup from "./components/Popup/Popup";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

const initialData = {
  name: "",
  description: "",
  userId: "",
};

function App({ signOut, user }) {
  const [pullUpBarList, setPullUpBarList] = useState();
  const [formData, setFormData] = useState(initialData);
  const formRef = useRef();
  const [popupVisible, setPopupVisible] = useState(false);

  async function addPullUpBar(name, description) {
    try {
      await API.graphql({
        query: createPullUpBar,
        variables: {
          input: {
            name: name,
            description: description,
            userID: user.username,
          },
        },
      }).then((result) => {
        setPullUpBarList((prev) => {
          return [result.data.createPullUpBar, ...prev];
        });
      });
    } catch (err) {
      console.log("error creating pullUpBar:", err);
    }
  }

  async function getAllPullUpBars() {
    try {
      await API.graphql({
        query: listPullUpBarsByUser(user.username),
      }).then((response) => {
        setPullUpBarList(response.data?.listPullUpBars?.items);
      });
    } catch {}
  }

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

  // function handleUpload(e) {
  //   console.log(e.target.files);
  // }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    formRef.current?.reset();
    addPullUpBar(formData.name, formData.description);
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

  useEffect(() => {
    getAllPullUpBars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  </li>
                );
              })}
          </ul>

          <Popup
            display={popupVisible}
            popupButtonText={'Cancel'}
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
                  {/* <input multiple onChange={handleUpload} type={"file"} /> */}

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
