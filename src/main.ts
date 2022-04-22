import { Firebot } from "firebot-custom-scripts-types";
import { buildOverlayTimerEffectType } from "./overlay-timer-effect";

interface Params {}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Overlay Timer",
      description: "This adds an Overlay Timer Effect to Firebot",
      author: "Perry",
      version: "0.1",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest) => {
    const { effectManager, frontendCommunicator } = runRequest.modules;
    const { logger } = runRequest.modules;
    const request = (runRequest.modules as any).request;
    effectManager.registerEffect(
      buildOverlayTimerEffectType(request, frontendCommunicator)
    );
  },
};

export default script;
