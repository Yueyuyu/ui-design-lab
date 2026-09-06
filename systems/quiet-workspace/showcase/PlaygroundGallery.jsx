import { SettingsPlayground } from "../../../src/gallery/SettingsPlayground.jsx";
import { QuietButton, QuietField, QuietSelect, QuietToggle, QuietCard } from "../web/index.js";
export function PlaygroundGallery({onNotify}) { return <SettingsPlayground suiteId="quiet-workspace" Button={QuietButton} Field={QuietField} Select={QuietSelect} Toggle={QuietToggle} Panel={QuietCard} onNotify={onNotify}/>; }
