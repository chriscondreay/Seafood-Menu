import React from "react";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import PropTypes from "prop-types";
import Login from "./Login";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

class Inventory extends React.Component {
  state = {
    isAuthenticating: false
  }

  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    addFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  };

  authenticate = async (providerName) => {
    if (this.state.isAuthenticating) return;
    this.setState({ isAuthenticating: true });
    const auth = getAuth();
    let provider;
    if (providerName === "Github") provider = new GithubAuthProvider();
    if (providerName === "Google") provider = new GoogleAuthProvider();
    // Add Email provider logic if needed
    if (provider) {
      try {
        await signInWithPopup(auth, provider); 
      } catch (err) {
        console.error("Authentication error:", err);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return <Login authenticate={this.authenticate} isAuthenticating={this.state.isAuthenticating} />;
    }
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map((key) => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>Load Samples</button>
      </div>
    );
  }
};

Inventory.propTypes = {
  fishes: PropTypes.object,
  updateFish: PropTypes.func,
  deleteFish: PropTypes.func,
  addFish: PropTypes.func,
  loadSampleFishes: PropTypes.func
}

export default Inventory;
