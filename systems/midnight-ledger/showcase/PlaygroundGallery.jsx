import { SettingsPlayground } from "../../../src/gallery/SettingsPlayground.jsx";
import { LedgerButton, LedgerField, LedgerSelect, LedgerToggle, LedgerPanel } from "../web/index.js";
export function PlaygroundGallery({onNotify}) { return <SettingsPlayground suiteId="midnight-ledger" Button={LedgerButton} Field={LedgerField} Select={LedgerSelect} Toggle={LedgerToggle} Panel={LedgerPanel} onNotify={onNotify}/>; }
