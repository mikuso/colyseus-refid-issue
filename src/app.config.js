import config from "@colyseus/tools";
import express from 'express';
import { MyRoom } from "./MyRoom.js";

export default config({

    initializeGameServer: (gameServer) => {
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        app.use(express.static('./public'));
    }

});
