import { useState, useRef, useEffect } from "react";

function Root() {
  const [files, setFiles] = useState([]);
  const input = useRef();

  const changeHandler = (e) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...e.target.files];
    });
  };
  
  useEffect(() => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    input.current.files = dataTransfer.files;
  }, [files]);

  const clearInputValue = (index) => {
    const dataTransfer = new DataTransfer();
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      newFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      input.current.files = dataTransfer.files;
      return newFiles;
    });
  };

  return (
    <>
      <form>
        <p>
          <label htmlFor="image">Browse images</label>
          <input
            ref={input}
            type="file"
            id="image"
            accept=".png, .jpg, .jpeg"
            multiple // Allow multiple file selection
            onChange={changeHandler}
          />
        </p>
        <p>
          <input type="submit" label="Upload" />
        </p>
      </form>
      {files.length > 0 ? (
        <div>
          {files.map((file, index) => (
            <div key={index} style={{ display: "inline-block", margin: "5px" }}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{ width: "150px", height: "150px", border: "1px solid" }}
                onClick={() => clearInputValue(index)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default Root;
