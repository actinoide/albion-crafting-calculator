"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApiCall = void 0;
const electron_fetch_1 = __importDefault(require("electron-fetch"));
const makeApiCall = (siteUrl) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, electron_fetch_1.default)(siteUrl);
    if (!result.ok) {
        throw new Error("invalid response from server. error code:" + result.status + " " + result.statusText);
    }
    try {
        let returnedJson = yield result.json();
        return returnedJson;
    }
    catch (_a) {
        throw new Error("failed to retrieve json contents of api response");
    }
});
exports.makeApiCall = makeApiCall;
