import { Firebot, ScriptModules } from "firebot-custom-scripts-types";
import { resolve } from "path";
import { logger } from "./logger";

const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

interface EffectModel {
    enterDuration: any;
    exitAnimation: any;
    exitDuration: any;
    customCoords: any;
    position: any;
    duration: any;
    height: any;
    width: any;
    justify: any;
    align: any;
    dontWrap: any;
    debugBorder: any;
    dropShadow: any;
    overlayInstance: any;
    enterAnimation: any;
    inbetweenRepeat: any;
    inbetweenDuration: any;
    inbetweenDelay: any;
    inbetweenAnimation: any;
    timerTitle: String;
    timerDuration: Number;
    timerOverlay: Text;
}

export function buildOverlayTimerEffectType(
    request: any,
    frontendCommunicator: ScriptModules ["frontendCommunicator"]
) {
    const overlayTimerEffectType: Firebot.EffectType<EffectModel> = {
        definition: {
            id: "perry:overlay-timer",
            name: "Overlay Timer",
            description: "Shows a countdown timer in the overlay.",
            icon: "fad fa-hourglass",
            categories: ["overlay"],
            dependencies: [],
            triggers: {
                command: true,
                custom_script: true,
                startup_script: true,
                api: true,
                event: true,
                hotkey: true,
                timer: true,
                counter: true,
                preset: true,
                manual: true,
            },
        },
        optionsTemplate: `
            <eos-container header="Timer Name">
                <firebot-input input-title="Title" model="effect.timerTitle" placeholder="Enter a name for the timer."></firebot-input>
                <label class="control-fb control--checkbox" style="margin-top:15px"> Show Timer name
                        <input type="checkbox" ng-model="effect.timerIncludeName">
                        <div class="control__indicator"></div>
                </label>
                <firebot-input input-title="Duration" model="effect.timerDuration" placeholder="Enter time in seconds."></firebot-input>
            </eos-container>
            <eos-container header="Advanced Settings" class="setting-padtop">
                <label class="control-fb control--checkbox">Show Advanced Settings
                    <input type="checkbox" ng-model="effect.isAdvancedSettings" >
                    <div class="control__indicator"></div>
                </label>
                <div ng-show="effect.isAdvancedSettings" class="ml-6 mb-10">
                    <div class="input-group" style="margin-bottom: 10px;">
                        <span class="input-group-addon">Width (in pixels)</span>
                        <input
                            class="form-control"
                            type="number"
                            min="1" max="10000"
                            ng-model="effect.width">
                        <span class="input-group-addon">Height (in pixels)</span>
                        <input
                            class="form-control"
                            type="number"
                            min="1" max="10000"
                            ng-model="effect.height">
                    </div>
                    <p>This defines the size of the (invisible) box that the above timer will be placed in.</p>

                    <label class="control-fb control--checkbox"> Show Debug Border <tooltip text="'Show a red border around the timer to make it easier to see its position.'"></tooltip>
                        <input type="checkbox" ng-model="effect.debugBorder" />
                        <div class="control__indicator"></div>
                    </label>

                    <p>Justification</p>
                    <label class="control-fb control--radio">Left
                        <input type="radio" ng-model="effect.justify" value="flex-start"/>
                        <div class="control__indicator"></div>
                    </label>
                    <label class="control-fb control--radio" >Center
                        <input type="radio" ng-model="effect.justify" value="center"/>
                        <div class="control__indicator"></div>
                    </label>
                    <label class="control-fb control--radio" >Right
                        <input type="radio" ng-model="effect.justify" value="flex-end"/>
                        <div class="control__indicator"></div>
                    </label>

                    <p>Align</p>
                    <label class="control-fb control--radio">Top
                        <input type="radio" ng-model="effect.align" value="flex-start"/>
                        <div class="control__indicator"></div>
                    </label>
                    <label class="control-fb control--radio" >Center
                        <input type="radio" ng-model="effect.align" value="center"/>
                        <div class="control__indicator"></div>
                    </label>
                    <label class="control-fb control--radio" >Bottom
                        <input type="radio" ng-model="effect.align" value="flex-end"/>
                        <div class="control__indicator"></div>
                    </label>
                </div>
            </eos-container>

            <eos-container header="Overlay positioning" class="setting-padtop">
                <label class="control-fb control--checkbox">Show Overlay Settings
                    <input type="checkbox" ng-model="effect.isOverlaySettings" >
                    <div class="control__indicator"></div>
                </label>
            </eos-container>
            <div ng-show="effect.isOverlaySettings">

                <eos-overlay-position effect="effect" class="setting-padtop"></eos-overlay-position>

                <eos-enter-exit-animations effect="effect" class="setting-padtop"></eos-enter-exit-animations>

                <eos-overlay-instance effect="effect" class="setting-padtop"></eos-overlay-instance>
            </div>

            <div class="effect-info alert alert-warning">
                This effect requires the Firebot overlay to be loaded in your broadcasting software.
            </div>
            `,
        optionsController: ($scope) => {
        },
        optionsValidator: (effect) => {
            let errors = [];
            if(effect.timerTitle == null || effect.timerTitle.length < 1 ){
                errors.push("Please enter name for the timer");
            }
            if(effect.timerDuration == null ){
                errors.push("Please enter a value for the timer");
            }
            return errors;
        },
        onTriggerEvent: (event) => {
            return new Promise((resolve) => {
                const effect = event.effect;

                //data transfer object
                let dto = {
                    timerTitle: effect.timerTitle,
                    timerDuration: effect.timerDuration,
                    inbetweenAnimation: effect.inbetweenAnimation,
                    inbetweenDelay: effect.inbetweenDelay,
                    inbetweenDuration: effect.inbetweenDuration,
                    inbetweenRepeat: effect.inbetweenRepeat,
                    enterAnimation: effect.enterAnimation,
                    enterDuration: effect.enterDuration,
                    exitAnimation: effect.exitAnimation,
                    exitDuration: effect.exitDuration,
                    customCoords: effect.customCoords,
                    position: effect.position,
                    duration: effect.duration,
                    height: effect.height,
                    width: effect.width,
                    justify: effect.justify,
                    align: effect.align,
                    debugBorder: effect.debugBorder,
                    dropShadow: effect.dropShadow,
                    overlayInstance: effect.overlayInstance
                };

                // Ensure defaults
                if (dto.duration <= 0) {
                    logger.debug("Effect duration is less than 0, resetting duration to 5 sec");
                    dto.duration = 5;
                }

                if (dto.height == null || dto.height < 1) {
                    logger.debug("Setting default height");
                    dto.height = 200;
                }

                if (dto.width == null || dto.width < 1) {
                    logger.debug("Setting default width");
                    dto.width = 400;
                }

                if (dto.position === "" || dto.position == null) {
                    logger.debug("Setting default overlay position");
                    dto.position = "Middle";
                }

                if (dto.justify == null) {
                    dto.justify = "center";
                }

                if (dto.align == null) {
                    dto.align = "center";
                }

                // This is broken as I have no way to hook into it...
                // Could it be added to ScriptModules so that it's available for custom scripts? :thinking_face:
                console.log("Settings from overlayTimerEffect: ");
                console.log(dto);
                //webServer.sendToOverlay("html", dto);
                //return true;

            });
        },
    };
    return overlayTimerEffectType;
}