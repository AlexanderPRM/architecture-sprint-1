import React from "react";
import AddPlacePopup from "./components/AddPlacePopup";
import EditAvatarPopup from "./components/EditAvatarPopup";
import ImagePopup from "./components/ImagePopup";
import PopupWithForm from "./components/PopupWithForm";

import { BrowserRouter, Redirect, Route } from "react-router-dom";

const App = () => {

    return (
        <BrowserRouter>
            <AddPlacePopup></AddPlacePopup>
            <EditAvatarPopup></EditAvatarPopup>
            <ImagePopup></ImagePopup>
            <PopupWithForm></PopupWithForm>
        </BrowserRouter>
    )
}

export default App;