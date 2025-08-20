
import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Fish from "./Fish";
import sampleFishes from "../sample-fishes";
import { base } from "../base";
import { ref, onValue, set, off } from "firebase/database";
import { useParams } from "react-router-dom";

class App extends React.Component {
    state = {
        fishes: {},
        order: {}
    };


    componentDidMount() {
        const { storeId } = this.props.params || {};
        if (storeId) {
            const localStorageRef = localStorage.getItem(storeId);
            if (localStorageRef) {
                this.setState({ order: JSON.parse(localStorageRef) });
            }
            this.fishesRef = ref(base, `${storeId}/fishes`);
            this.unsubscribe = onValue(this.fishesRef, (snapshot) => {
                const data = snapshot.val() || {};
                this.setState({ fishes: data });
            });
        }
    }

    componentDidUpdate() {
        const { storeId } = this.props.params || {};
        if (storeId) {
            localStorage.setItem(storeId, JSON.stringify(this.state.order));
        }
    }

    componentWillUnmount() {
        if (this.fishesRef) {
            off(this.fishesRef);
        }
    }


    addFish = (fish) => {
        const { storeId } = this.props.params || {};
        const fishes = { ...this.state.fishes };
        fishes[`fish${Date.now()}`] = fish;
        this.setState({ fishes }, () => {
            if (storeId) {
                set(ref(base, `${storeId}/fishes`), this.state.fishes);
            }
        });
    };


    loadSampleFishes = () => {
        const { storeId } = this.props.params || {};
        this.setState({ fishes: sampleFishes }, () => {
            if (storeId) {
                set(ref(base, `${storeId}/fishes`), sampleFishes);
            }
        });
    };

    addToOrder = (key) => {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({ order });
    }
    
    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => (
                            <Fish 
                                key={key}
                                index={key}
                                details={this.state.fishes[key]} 
                                addToOrder={this.addToOrder} 
                            />
                        ))}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} />
                <Inventory addFish={this.addFish} loadSampleFishes={this.loadSampleFishes} />
            </div>
        )
    }
}


// Wrapper to inject params from React Router v6
function AppWithParams(props) {
    const params = useParams();
    return <App {...props} params={params} />;
}

export default AppWithParams;