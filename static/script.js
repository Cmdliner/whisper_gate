var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var roomId = document.body.dataset.roomId;
    var ws = new WebSocket("ws://".concat(location.host, "/ws/rooms/").concat(roomId));
    var videos = document.querySelector('#videos');
    var localVideo = document.querySelector('#localFeed');
    var peers = {};
    var localStream;
    (_a = document.querySelector('#startCall')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                case 1:
                    localStream = _a.sent();
                    localVideo.srcObject = localStream;
                    ws.send(JSON.stringify({ type: 'start' }));
                    return [2 /*return*/];
            }
        });
    }); });
    ws.onmessage = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var msg, peerId, _a, peer, answer, peer, peer, peer, offer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msg = JSON.parse(event.data);
                    peerId = msg.from;
                    _a = msg.type;
                    switch (_a) {
                        case 'offer': return [3 /*break*/, 1];
                        case 'answer': return [3 /*break*/, 5];
                        case 'ice': return [3 /*break*/, 7];
                        case 'join': return [3 /*break*/, 9];
                        case 'start': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    peer = createPeer(peerId);
                    return [4 /*yield*/, peer.setRemoteDescription(new RTCSessionDescription(msg.offer))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, peer.createAnswer()];
                case 3:
                    answer = _b.sent();
                    return [4 /*yield*/, peer.setLocalDescription(answer)];
                case 4:
                    _b.sent();
                    ws.send(JSON.stringify({ type: 'answer', answer: peer.localDescription, to: peerId }));
                    return [3 /*break*/, 13];
                case 5:
                    peer = peers[peerId];
                    return [4 /*yield*/, peer.setRemoteDescription(new RTCSessionDescription(msg.answer))];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    peer = peers[peerId];
                    return [4 /*yield*/, peer.addIceCandidate(new RTCIceCandidate(msg.candidate))];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    if (!(peerId && !peers[peerId])) return [3 /*break*/, 12];
                    peer = createPeer(peerId);
                    return [4 /*yield*/, peer.createOffer()];
                case 10:
                    offer = _b.sent();
                    return [4 /*yield*/, peer.setLocalDescription(offer)];
                case 11:
                    _b.sent();
                    ws.send(JSON.stringify({ type: 'offer', offer: peer.localDescription, to: peerId }));
                    _b.label = 12;
                case 12: return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    function createPeer(peerId) {
        var peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        peers[peerId] = peer;
        localStream.getTracks().forEach(function (track) { return peer.addTrack(track, localStream); });
        peer.onicecandidate = function (e) {
            if (e.candidate)
                ws.send(JSON.stringify({ type: 'ice', candidate: e.candidate, to: peerId }));
        };
        peer.ontrack = function (e) {
            var remoteVideo = document.createElement('video');
            remoteVideo.srcObject = e.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            videos === null || videos === void 0 ? void 0 : videos.appendChild(remoteVideo);
        };
        return peer;
    }
});
