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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
    var myId = "".concat(Math.random().toString(36).substr(2, 9), "-").concat(Date.now());
    var protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    var ws = new WebSocket("".concat(protocol, "//").concat(location.host, "/ws/rooms/").concat(roomId));
    var videos = document.querySelector('#videos');
    var localVideo = document.querySelector('#localFeed');
    var peers = {};
    var pendingIceCandidates = {};
    var localStream;
    var isCallStarted = false;
    var readyPeers = new Set();
    ws.onopen = function () {
        ws.send(JSON.stringify({ type: 'join', from: myId }));
    };
    ws.onmessage = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var msg, peerId, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 12, , 13]);
                    msg = JSON.parse(event.data);
                    peerId = msg.from;
                    if (peerId === myId)
                        return [2 /*return*/];
                    _a = msg.type;
                    switch (_a) {
                        case 'offer': return [3 /*break*/, 1];
                        case 'answer': return [3 /*break*/, 3];
                        case 'ice': return [3 /*break*/, 5];
                        case 'start': return [3 /*break*/, 7];
                        case 'leave': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, handleOffer(peerId, msg.offer)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 3: return [4 /*yield*/, handleAnswer(peerId, msg.answer)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, handleIceCandidate(peerId, msg.candidate)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 7:
                    readyPeers.add(peerId);
                    if (!(isCallStarted && !peers[peerId] && myId > peerId)) return [3 /*break*/, 9];
                    return [4 /*yield*/, createOffer(peerId)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    cleanupPeer(peerId);
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_1 = _b.sent();
                    console.error('Error parsing message:', err_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    ws.onclose = function () { return setTimeout(function () { return location.reload(); }, 3000); };
    (_a = document.querySelector('#startCall')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isCallStarted)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true
                        })];
                case 2:
                    localStream = _a.sent();
                    localVideo.srcObject = localStream;
                    isCallStarted = true;
                    ws.send(JSON.stringify({ type: 'start', from: myId }));
                    readyPeers.forEach(function (peerId) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!peers[peerId] && myId > peerId)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, createOffer(peerId)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    alert("Error accessing camera/microphone");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    function createOffer(peerId) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, offer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (peers[peerId])
                            return [2 /*return*/];
                        peer = createPeer(peerId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, peer.createOffer()];
                    case 2:
                        offer = _a.sent();
                        return [4 /*yield*/, peer.setLocalDescription(offer)];
                    case 3:
                        _a.sent();
                        ws.send(JSON.stringify({
                            type: 'offer',
                            offer: peer.localDescription,
                            to: peerId,
                            from: myId
                        }));
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        cleanupPeer(peerId);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function handleOffer(peerId, offer) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, answer, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!localStream || peers[peerId])
                            return [2 /*return*/];
                        peer = createPeer(peerId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, peer.setRemoteDescription(new RTCSessionDescription(offer))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, peer.createAnswer()];
                    case 3:
                        answer = _a.sent();
                        return [4 /*yield*/, peer.setLocalDescription(answer)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, processPendingIceCandidates(peerId)];
                    case 5:
                        _a.sent();
                        ws.send(JSON.stringify({
                            type: 'answer',
                            answer: peer.localDescription,
                            to: peerId,
                            from: myId
                        }));
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        cleanupPeer(peerId);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function handleAnswer(peerId, answer) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        peer = peers[peerId];
                        if (!peer)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, peer.setRemoteDescription(new RTCSessionDescription(answer))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processPendingIceCandidates(peerId)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        cleanupPeer(peerId);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function handleIceCandidate(peerId, candidate) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        peer = peers[peerId];
                        if (!peer || !candidate)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!peer.remoteDescription) {
                            if (!pendingIceCandidates[peerId]) {
                                pendingIceCandidates[peerId] = [];
                            }
                            pendingIceCandidates[peerId].push(candidate);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, peer.addIceCandidate(new RTCIceCandidate(candidate))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error adding ICE candidate:', error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function processPendingIceCandidates(peerId) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, candidate, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(pendingIceCandidates[peerId] && peers[peerId])) return [3 /*break*/, 7];
                        _i = 0, _a = pendingIceCandidates[peerId];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        candidate = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, peers[peerId].addIceCandidate(new RTCIceCandidate(candidate))];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _b.sent();
                        console.error('Error adding buffered ICE candidate:', error_6);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        delete pendingIceCandidates[peerId];
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createPeer(peerId) {
        var isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        var peer = new RTCPeerConnection({
            iceServers: isLocalhost ?
                [{ urls: 'stun:stun.l.google.com:19302' }] :
                [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    {
                        urls: 'turn:openrelay.metered.ca:80',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    }
                ]
        });
        peers[peerId] = peer;
        if (localStream) {
            localStream.getTracks().forEach(function (track) {
                peer.addTrack(track, localStream);
            });
        }
        peer.onicecandidate = function (e) {
            if (e.candidate) {
                ws.send(JSON.stringify({
                    type: 'ice',
                    candidate: e.candidate,
                    to: peerId,
                    from: myId
                }));
            }
        };
        peer.ontrack = function (e) {
            var remoteVideo = document.getElementById("remote-".concat(peerId));
            if (!remoteVideo) {
                remoteVideo = document.createElement('video');
                remoteVideo.id = "remote-".concat(peerId);
                remoteVideo.autoplay = true;
                remoteVideo.playsInline = true;
                remoteVideo.style.width = '300px';
                remoteVideo.style.height = '200px';
                remoteVideo.style.border = '2px solid #333';
                remoteVideo.style.margin = '10px';
                videos === null || videos === void 0 ? void 0 : videos.appendChild(remoteVideo);
            }
            if (e.streams[0]) {
                remoteVideo.srcObject = e.streams[0];
            }
        };
        peer.onconnectionstatechange = function () {
            if (peer.connectionState === 'failed') {
                setTimeout(function () {
                    if (peer.connectionState === 'failed') {
                        cleanupPeer(peerId);
                    }
                }, 2000);
            }
            else if (peer.connectionState === 'disconnected') {
                setTimeout(function () {
                    if (peer.connectionState === 'disconnected') {
                        cleanupPeer(peerId);
                    }
                }, 10000);
            }
        };
        peer.oniceconnectionstatechange = function () {
            if (peer.iceConnectionState === 'failed') {
                peer.restartIce();
            }
        };
        return peer;
    }
    function cleanupPeer(peerId) {
        var video = document.getElementById("remote-".concat(peerId));
        if (video)
            video.remove();
        if (peers[peerId]) {
            peers[peerId].close();
            delete peers[peerId];
        }
        if (pendingIceCandidates[peerId]) {
            delete pendingIceCandidates[peerId];
        }
        readyPeers.delete(peerId);
    }
});
