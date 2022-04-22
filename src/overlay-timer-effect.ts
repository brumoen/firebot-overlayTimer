import { Firebot, ScriptModules } from "firebot-custom-scripts-types";
import { resolve } from "path";

const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

interface EffectModel {
    text: String;
    timerTitle: String;
    timerTime: Number;
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
                <firebot-input input-title="Time" model="effect.timerTime" placeholder="Enter time in seconds."></firebot-input>
            </eos-container>
            <eos-container header="Container Settings" class="setting-padtop">
                <p>This defines the size of the (invisible) box that the above timer will be placed in.</p>
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
            </eos-container>

            <eos-overlay-position effect="effect" class="setting-padtop"></eos-overlay-position>

            <eos-enter-exit-animations effect="effect" class="setting-padtop"></eos-enter-exit-animations>

            <eos-overlay-instance effect="effect" class="setting-padtop"></eos-overlay-instance>

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
            if(effect.timerTime == null ){
                errors.push("Please enter a value for the timer");
            }
            return errors;
        },
        onTriggerEvent: (event) => {
            return new Promise((resolve) => {
                const effect = event.effect;
                console.log("Settings from overlayTimerEffect: ");
                console.log(effect);
            });
        },
    };
    return overlayTimerEffectType;
}