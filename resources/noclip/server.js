import server from "alt-server";

server.onClient("EasyNoClip:toggle", (player, isActive) => {
    player.visible = !isActive;
});
