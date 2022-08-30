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
const tier_equiv = document.getElementById("tier-equiv");
if (!tier_equiv) {
    console.log("tier-equiv not found");
}
else {
    tier_equiv.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
        yield window.electronAPI.onContentChanged(tier_equiv.value);
    }));
}
