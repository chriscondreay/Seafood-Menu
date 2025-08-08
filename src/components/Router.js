import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StorePicker from "./StorePicker";
import NotFound from "./NotFound";
import App from "./App";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StorePicker />} />
                <Route path="/store/:storeId" element={<App />} />
                <Route element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;