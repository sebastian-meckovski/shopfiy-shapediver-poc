import logo from "./logo.svg";
import "./App.css";
import { createBlog, deleteBlog } from "./graphql/mutations";
import { listBlogs } from "./graphql/queries";
import { Amplify, API } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
Amplify.configure(awsExports);

const initialData = {
  name: "",
  description: "",
};

function App() {
  const [blogList, setBlogList] = useState();
  const [formData, setFormData] = useState(initialData);

  async function addBlog(name, description) {
    try {
      await API.graphql({
        query: createBlog,
        variables: { input: { name: name, description: description } },
      }).then((result) => {
        setBlogList((prev) => {
          return [...prev, result.data.createBlog];
        });
      });
    } catch (err) {
      console.log("error creating blog:", err);
    }
  }

  async function getAllBlogs() {
    try {
      await API.graphql({
        query: listBlogs,
      }).then((response) => {
        setBlogList(response.data?.listBlogs?.items);
      });
    } catch {}
  }
  useEffect(() => {
    getAllBlogs();
  }, []);

  async function removeBLog(id) {
    try {
      await API.graphql({
        query: deleteBlog,
        variables: {
          input: { id: id },
        },
      }).then((response) => {
        setBlogList((prev) => {
          return prev.filter((x) => {
            return x?.id !== response?.data?.deleteBlog?.id;
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    addBlog(formData.name, formData.description);
    setFormData(initialData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            required
            type="text"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>

        {blogList &&
          blogList.map((x) => {
            return (
              <span key={x.id}>
                {x.name} - {x.description}{" "}
                <button
                  onClick={() => {
                    removeBLog(x.id);
                  }}
                >
                  X
                </button>
              </span>
            );
          })}
      </header>
    </div>
  );
}

export default App;
