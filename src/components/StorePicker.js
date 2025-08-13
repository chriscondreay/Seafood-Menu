import React from "react";
import { getFunName } from "../helpers";
import { useNavigate } from "react-router-dom";

class StorePicker extends React.Component {
  input = React.createRef();

  goToStore = (e) => {
    e.preventDefault();
    const storeName = this.input.current.value;
    this.props.navigate(`/store/${storeName}`);
  }

  render() {
    return (
      <>
        <form action="" className="store-selector" onSubmit={this.goToStore}>
          <h2>Please Enter A Store</h2>
          <input 
            type="text" 
            ref={this.input}
            placeholder="Store Name" 
            required 
            defaultValue={getFunName()} 
          />
          <button type="submit">Visit Store →</button>
        </form>
      </>
    )
  }
}

function StorePickerWrapper(props) {
  const navigate = useNavigate();
  return <StorePicker {...props} navigate={navigate} />;
}

export default StorePickerWrapper;