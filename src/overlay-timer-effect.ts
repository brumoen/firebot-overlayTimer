import { Firebot, RunRequest, ScriptModules } from "firebot-custom-scripts-types";
import { resolve } from "path";
import { logger } from "./logger";

const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

interface EffectModel {
    timerTitle: string;
    timerDuration: number;
    endTriggerCallUrl: string;
    timerIncludeName: Boolean;
    inbetweenAnimation: any;
    inbetweenDelay: number;
    inbetweenDuration: number;
    inbetweenRepeat: any;
    enterAnimation: any;
    enterDuration: number;
    exitAnimation: any;
    exitDuration: number;
    customCoords: any;
    position: any;
    duration: number;
    height: number;
    width: number;
    justify: string;
    align: string;
    debugBorder: Boolean;
    dropShadow: Boolean;
    overlayInstance: string;
    html: string;
    
}

export function buildOverlayTimerEffectType(
    request: any,
    frontendCommunicator: ScriptModules ["frontendCommunicator"],
    runRequest: any
) {
    const overlayTimerEffectType: Firebot.EffectType<EffectModel> = {
        definition: {
            id: "perry:overlay-timer-rewrite",
            name: "Overlay Timer - Rewrite",
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

                <!-- <firebot-input input-title="Timer Ended" model="effect.endTriggerCallUrl" placeholder="Time Up Trigger."></firebot-input> -->
            </eos-container>

            <!-- Advanced Settings Accordion -->
            <eos-container>
                <div style="margin-bottom: 20px; margin-top: 20px;">
                    <div class="sys-command-row" ng-init="hidePanel = true" ng-click="hidePanel = !hidePanel" ng-class="{expanded: !hidePanel}">
                        <div style="flex-basis: 100%;padding-left: 20px;">
                            Advanced Settings
                        </div>
                        <div style="flex-basis:30px; flex-shrink: 0;">
                            <i class="fas" ng-class="{fa-chevron-right: hidePanel, fa-chevron-down: !hidePanel}"></i>
                        </div>
                    </div>
                    <div uib-collapse="hidePanel" class="sys-command-expanded">
                        <div style="padding: 15px 20px 10px 20px;">
                            <div class="muted" style="font-weight:bold; font-size: 12px;">
                                DESCRIPTION
                            </div>
                            <p style="font-size: 12px">
                                Here you can choose what the timer is supposed to do when it runs out,<br/>
                                as well as set how long it should be visible on the screen after it runs out
                            </p>
                            <div>
                                <firebot-input input-title="Timer Trigger" model="effect.endTriggerCallUrl" placeholder="Time Up Trigger."></firebot-input>
                                <p style="font-size: 10px">
                                    * You can add a Preset Effect List URL here to have the counter trigger actions when done.
                                </p>
                            </div>
                            <div>
                                <firebot-input input-title="Timer Delay" model="effect.timerDelay" placeholder="Timer Delay."></firebot-input>
                                <p style="font-size: 10px">
                                    * How long do you want the timer to stay on screen when it's done?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </eos-container>
            <!-- /Advanced Settings Accordion ends -->

            <!-- Overlay Settings Accordion -->
            <eos-container>
                <div style="margin-bottom: 20px; margin-top: 20px;">
                    <div class="sys-command-row" ng-init="hidePanel = true" ng-click="hidePanel = !hidePanel" ng-class="{expanded: !hidePanel}">
                        <div style="flex-basis: 100%;padding-left: 20px;">
                            Overlay Settings
                        </div>
                        <div style="flex-basis:30px; flex-shrink: 0;">
                            <i class="fas" ng-class="{fa-chevron-right: hidePanel, fa-chevron-down: !hidePanel}"></i>
                        </div>
                    </div>
                    <div uib-collapse="hidePanel" class="sys-command-expanded">
                        <div style="padding: 15px 20px 10px 20px;">
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
                    </div>
                </div>
            </eos-container>
            <!-- /Overlay Settings Accordion ends -->
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
                logger.debug("effect: ", effect);
                logger.debug("endTrigger: ", effect.endTriggerCallUrl);
                const timeStamp = Date.now();
                const removal = `timer_${timeStamp}`;

                const styleHTML = `
                    <style>
                        body {
                            font-family: "press start 2p";
                            display: grid;
                            place-items: center;
                            /* background-color: black; */
                        }
                    
                        .title_background_${removal} {
                            /* transform: scale(0.3, 0.3); */
                            position: relative !important;
                            display: flex;
                            align-content: center;
                            justify-content: center;
                            bottom: 0px;
                            top: 5px;
                            left: 5px;
                            width: max-width;
                            height: 320px;
                            border-radius: 150px;
                            background-color: #80808055;
                            overflow: hidden;
                        }
                    
                        .base-timer_${removal} {
                            position: relative;
                            width: 300px;
                            height: 300px;
                            top:10px;
                            left:10px;
                        }
                    
                        .base-timer__svg_${removal} {
                            transform: scaleX(-1);
                        }
                    
                        .base-timer__circle_${removal} {
                            fill: transparent;
                            stroke: none;
                        }
                    
                        .base-timer__path-elapsed_${removal} {
                            stroke-width: 7px;
                            /* stroke: black; */
                        }
                    
                        .base-timer__path-remaining_${removal} {
                            stroke-width: 7px;
                            stroke-linecap: round;
                            transform: rotate(90deg);
                            transform-origin: center;
                            transition: 1s linear all;
                            fill-rule: nonzero;
                            stroke: currentColor;
                        }
                    
                        .base-timer__path-remaining_${removal}.green {
                            color: #503A60;
                        }
                    
                        .base-timer__path-remaining_${removal}.orange {
                            color: #E7A916;
                        }
                    
                        .base-timer__path-remaining_${removal}.red {
                            color: red;
                        }
                    
                        .base-timer__label_${removal} {
                            position: absolute;
                            width: 300px;
                            height: 300px;
                            top: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 80px;
                        }
                    
                        #title_${removal} {
                            width: max-width;
                            height: 320px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 80px;
                            padding-right:20px;
                            padding-left:20px;
                            /* background-color: #80808055; */
                        }
                    </style>
                `;

                const jsHTML = `
                <script>
                    // Credit: Mateusz Rybczonec

                    const FULL_DASH_ARRAY_${removal} = 283;
                    const WARNING_THRESHOLD_${removal} = 15;
                    const ALERT_THRESHOLD_${removal} = 5;

                    const COLOR_CODES_${removal} = {
                    info: {
                        color: "green"
                    },
                    warning: {
                        color: "orange",
                        threshold: WARNING_THRESHOLD_${removal}
                    },
                    alert: {
                        color: "red",
                        threshold: ALERT_THRESHOLD_${removal}
                    }
                    };
                    function gup( name_${removal} )
                    {
                        name_${removal} = name_${removal}.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                        var regexS = "[\\?&]"+name_${removal}+"=([^&#]*)";
                        var regex = new RegExp( regexS );
                        var results = regex.exec( window.location.href );
                        if( results == null )
                            return "";
                        else
                            return results[1];
                    }
                    const TIME_LIMIT_${removal} = ${effect.timerDuration};

                    var name_${removal} = "${effect.timerTitle}";
                    var endEventCall_${removal} = "${effect.endTriggerCallUrl}";

                    let timePassed_${removal} = 0;
                    let timeLeft_${removal} = TIME_LIMIT_${removal};
                    let timerInterval_${removal} = null;
                    let remainingPathColor_${removal} = COLOR_CODES_${removal}.info.color;

                    document.getElementById("timer_${removal}").innerHTML = \`
                    <div class="base-timer_${removal}">
                        <svg class="base-timer__svg_${removal}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g class="base-timer__circle_${removal}">
                            <circle class="base-timer__path-elapsed_${removal}" cx="50" cy="50" r="45"></circle>
                            <path
                                id="base-timer-path-remaining_${removal}"
                                stroke-dasharray="283"
                                class="base-timer__path-remaining_${removal} \${remainingPathColor_${removal}}"
                                d="
                                M 50, 50
                                m -45, 0
                                a 45,45 0 1,0 90,0
                                a 45,45 0 1,0 -90,0
                                "
                            ></path>
                            </g>
                        </svg>
                        <span id="base-timer-label_${removal}" class="base-timer__label_${removal}">
                            \${formatTime(timeLeft_${removal})}
                        </span>
                    </div>
                    \`;
                    document.getElementById("title_${removal}").innerText = name_${removal};
                    startTimer_${removal}();

                    function onTimesUp_${removal}() {
                        clearInterval(timerInterval_${removal});
                        fetch(endEventCall_${removal})
                                    .then(function (result) {
                                        console.log(result);
                                    })
                                    .catch(function (err) {
                                        console.error(err);
                                    });
                    }

                    function startTimer_${removal}() {
                        timerInterval_${removal} = setInterval(() => {
                            timePassed_${removal} = timePassed_${removal} += 1;
                            timeLeft_${removal} = TIME_LIMIT_${removal} - timePassed_${removal};
                            document.getElementById("base-timer-label_${removal}").innerHTML = formatTime(timeLeft_${removal});
                            setCircleDasharray_${removal}();
                            setRemainingPathColor_${removal}(timeLeft_${removal});

                            if (timeLeft_${removal} === 0) {
                            onTimesUp_${removal}();
                            }
                        }, 1000);
                    }

                    function formatTime(time) {
                        const minutes = Math.floor(time / 60);
                        let seconds = time % 60;

                        if (seconds < 10) {
                            seconds = \`0\${seconds}\`;
                        }

                        return \`\${minutes}:\${seconds}\`;
                    }

                    function setRemainingPathColor_${removal}(timeLeft_${removal}) {
                        const { alert, warning, info } = COLOR_CODES_${removal};
                        if (timeLeft_${removal} <= alert.threshold) {
                            document.getElementById("base-timer-path-remaining_${removal}").classList.remove(warning.color);
                            document.getElementById("base-timer-path-remaining_${removal}").classList.add(alert.color);
                        } else if (timeLeft_${removal} <= warning.threshold) {
                            document.getElementById("base-timer-path-remaining_${removal}").classList.remove(info.color);
                            document.getElementById("base-timer-path-remaining_${removal}").classList.add(warning.color);
                        }
                    }

                    function calculateTimeFraction_${removal}() {
                        const rawTimeFraction_${removal} = timeLeft_${removal} / TIME_LIMIT_${removal};
                        return rawTimeFraction_${removal} - (1 / TIME_LIMIT_${removal}) * (1 - rawTimeFraction_${removal});
                    }

                    function setCircleDasharray_${removal}() {
                        const circleDasharray_${removal} = \`\${(
                            calculateTimeFraction_${removal}() * FULL_DASH_ARRAY_${removal}
                        ).toFixed(0)} 283\`;
                    document.getElementById("base-timer-path-remaining_${removal}").setAttribute("stroke-dasharray", circleDasharray_${removal});
                    }
                </script>
                `;

                const contentsHTML = `
                <div class="title_background_${removal}">
                    <div id="timer_${removal}"></div>
                    <div id="title_${removal}"></div>
                </div>
                `
                
                let duration = +effect.timerDuration + +2;
                logger.debug('Duration: ', duration); // TODO: Remove before publishing
                let timerTitle = effect.timerTitle;
                logger.debug("removal1: ", removal);
                let combineHTML = styleHTML + contentsHTML + jsHTML;

                const timerHTML = `<div id="${removal}">${combineHTML}</div>`;
                logger.debug("removal2: ", removal);

                //data transfer object
                let dto = {
                    length: duration,
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
                    overlayInstance: effect.overlayInstance,
                    html: timerHTML
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

                logger.info("Settings from overlayTimerEffect: ");
                logger.debug("dto: ", dto);
                runRequest.modules.httpServer.sendToOverlay("html", dto);
                //webServer.sendToOverlay("html", dto);
                return true;

            });
        },
    };
    return overlayTimerEffectType;
}