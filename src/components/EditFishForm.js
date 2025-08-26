import { Component } from "react";
import PropTypes from "prop-types";

class EditFishForm extends Component {
  handleChange = (e) => {
    const updatedFish = {
      ...this.props.fish,
      [e.currentTarget.name]: e.currentTarget.value,
    };
    this.props.updateFish(this.props.index, updatedFish);
  };

  render() {
    const fish = this.props.fish;
    if (!fish) return null;
    return (
      <div className="fish-edit">
        <input
          type="text"
          name="name"
          onChange={this.handleChange}
          value={fish.name}
        />
        <input
          type="text"
          name="price"
          onChange={this.handleChange}
          value={fish.price}
        />
        <input
          type="text"
          name="status"
          onChange={this.handleChange}
          value={fish.status}
        />
        <select>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea
          name="desc"
          onChange={this.handleChange}
          value={fish.desc}
        />
        <input
          type="text"
          name="image"
          onChange={this.handleChange}
          value={fish.image}
        />
        <button onClick={() => this.props.deleteFish(this.props.index)}>Remove Fish</button>
      </div>
    );
  }
};

EditFishForm.propTypes = {
    fish: PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.string,
      desc: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.number
    }),
    index: PropTypes.number,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func
}

export default EditFishForm;
