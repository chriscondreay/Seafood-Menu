import React from "react";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import PropTypes from "prop-types";
import Login from "./Login";
import { firebaseApp } from "../base";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  onAuthStateChanged
} from "firebase/auth";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    addFish: PropTypes.func,
    loadSampleFishes: PropTypes.func,
  };

  state = {
    uid: null,
    owner: null,
  };

  componentDidMount() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.authHandler({ user });
      }
    });
  }

  authHandler = async (authData) => {
    // Fetch store data from Firebase Realtime Database using v9+ SDK
    // and set owner if not present
    const { getDatabase, ref, get, set } = await import("firebase/database");
    const db = getDatabase(firebaseApp);
    const storeRef = ref(db, `${this.props.storeId}/owner`);
    let ownerSnapshot = await get(storeRef);
    let owner = ownerSnapshot.exists() ? ownerSnapshot.val() : null;
    if (!owner) {
      await set(storeRef, authData.user.uid);
      owner = authData.user.uid;
    }
    this.setState({
      uid: authData.user.uid,
      owner: owner,
    });
  };

  authenticate = (provider) => {
    const auth = getAuth(firebaseApp);
    let authProvider;
    if (provider === "Github") {
      authProvider = new GithubAuthProvider();
    } else if (provider === "Google") {
      authProvider = new GoogleAuthProvider();
    } else {
      throw new Error("Unsupported provider");
    }
    signInWithPopup(auth, authProvider)
      .then(this.authHandler)
      .catch(async (error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          const auth = getAuth();
          const pendingCred = error.credential;
          const email = error.customData.email;
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Prompt user to sign in with the first provider in methods
          let provider;
          if (methods[0] === "google.com") provider = new GoogleAuthProvider();
          if (methods[0] === "github.com") provider = new GithubAuthProvider();

          signInWithPopup(auth, provider).then((result) => {
            // Link the pending credential
            linkWithCredential(result.user, pendingCred);
            alert(
              "Accounts linked! You can now sign in with either provider."
            );
          });
        } else {
          alert(error.message);
        }
      });
  };

  logout = async () => {
    const auth = getAuth(firebaseApp);
    await auth.signOut();
    this.setState({ uid: null });
  }

  render() {
    const logout = <button onClick={this.logout}>Logout</button>

    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner of this store!</p>
          {logout}
        </div>
      );
    }

    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {logout}
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
}

Inventory.propTypes = {
  fishes: PropTypes.object,
  updateFish: PropTypes.func,
  deleteFish: PropTypes.func,
  addFish: PropTypes.func,
  loadSampleFishes: PropTypes.func,
};

export default Inventory;
