import React, { useEffect, useState } from 'react';
import { useTrail, animated } from 'react-spring';
import { useTranslation } from 'react-i18next';
import configData from "../../../config.json";
import { NutrientPanel } from '../recommendation/Nutrient-gauge/Nutrient-panel';
import { HealthNeedGauge } from '../recommendation/Nutrient-gauge/HealthNeedsGauge';
import { AveragePlate } from './DashboardAveragePlate';
import { DashboardBadges } from './DashboardBadges';
import { DashboardHealthGoals } from './DashboardHealthGoals';
import fetchUrl from '../../../utils/fetchUrl';
import './style.css';


export function DashboardResults(props: any) {
    const [display, setDisplay] = useState(true);
    const [discomforts, setDiscomforts]:any = useState([]);
    const [preventions, setPreventions]:any = useState([]);
    const [nutrient, setnutrient]: any = useState([]);
    const [lifestyle, setLifestyle]:any = useState ([]);
    const [length , setLength] = useState([0, 0, 0, 0]);
    const { userInformation, isFull } = props;
    const arrayNutrient = [data1,data2] ;         
    
    useEffect(() => {
        fetchUrl(`${SERVER_URL}needs`, undefined, userInformation.quizId).then((healthNeedsJsonFinish:any) => {
            // healthNeedsJsonFinish.discomforts.total = healthNeedsJsonFinish.discomforts.cs.concat(healthNeedsJsonFinish.discomforts.ss ?? []) ?? [];
            // if (healthNeedsJsonFinish.preventions) {
            //     healthNeedsJsonFinish.preventions.total = healthNeedsJsonFinish.preventions.health_risks.concat(healthNeedsJsonFinish.preventions.prevents ?? []) ?? [];
            // }  
            if (healthNeedsJsonFinish.discomforts) {
                healthNeedsJsonFinish.discomforts = {
                    "cs": healthNeedsJsonFinish.discomforts.cs ? healthNeedsJsonFinish.discomforts.cs : [],
                    "ss": healthNeedsJsonFinish.discomforts.ss ? healthNeedsJsonFinish.discomforts.ss : []
                };
                healthNeedsJsonFinish.discomforts.total = healthNeedsJsonFinish.discomforts.cs.concat(healthNeedsJsonFinish.discomforts.ss);
            }
            if (healthNeedsJsonFinish.preventions) {
                healthNeedsJsonFinish.preventions = {
                    "health_risks": healthNeedsJsonFinish.preventions.health_risks ? healthNeedsJsonFinish.preventions.health_risks : [],
                    "prevents": healthNeedsJsonFinish.preventions.prevents ? healthNeedsJsonFinish.preventions.prevents : []
                };
                healthNeedsJsonFinish.preventions.total = healthNeedsJsonFinish.preventions.health_risks.concat(healthNeedsJsonFinish.preventions.prevents);
            }          
            
            // if healthNeedsJsonFinish.discomforts exist set in the json or put 0
            const lengthScore = {
                discomfortLen: healthNeedsJsonFinish.discomforts ? healthNeedsJsonFinish.discomforts.total.length : 0,
                preventionsLen: healthNeedsJsonFinish.preventions ? healthNeedsJsonFinish.preventions.total.length : 0,
            }
            setLength([lengthScore.discomfortLen, lengthScore.preventionsLen]);
            // put healthneeds in 6 per 6 in an double array
            const healthNeedsArray = [];
            let healthNeedsArrayTemp = [];
            for (let i = 0; i < lengthScore.discomfortLen; i += 1) {
                healthNeedsArrayTemp.push(healthNeedsJsonFinish.discomforts.total[i]);
                if (healthNeedsArrayTemp.length === 4) {
                    healthNeedsArray.push(healthNeedsArrayTemp);
                    healthNeedsArrayTemp = [];
                }
            }
            if (healthNeedsArrayTemp.length > 0) {
                for (let i = healthNeedsArrayTemp.length; i < 4; i += 1) {
                    healthNeedsArrayTemp.push({ title: '', icon: 'ghost' });
                }
                healthNeedsArray.push(healthNeedsArrayTemp);
            }

            // put healthneeds in 4 per 4 in an double array for preventions
            const healthNeedsArrayPreventions = [];
            let healthNeedsArrayTempPreventions = [];
            for (let i = 0; i < lengthScore.preventionsLen; i += 1) {
                healthNeedsArrayTempPreventions.push(healthNeedsJsonFinish.preventions.total[i]);
                if (healthNeedsArrayTempPreventions.length === 4) {
                    healthNeedsArrayPreventions.push(healthNeedsArrayTempPreventions);
                    healthNeedsArrayTempPreventions = [];
                }
            }
            if (healthNeedsArrayTempPreventions.length > 0) {
                for (let i = healthNeedsArrayTempPreventions.length; i < 4; i += 1) {
                    healthNeedsArrayTempPreventions.push({ title: '', icon: 'ghost' });
                }
                healthNeedsArrayPreventions.push(healthNeedsArrayTempPreventions);
            }

            setDiscomforts(healthNeedsArray);
            setPreventions(healthNeedsArrayPreventions);
           
        });
    }, []);

    const { t, i18n } = useTranslation();

    
    const arrowStylesBannerBenefits: any = {
        position: "absolute",
        top: "35%",
        bottom: "auto",
        zIndex: 2,
        width: "16px",
        height: "16px",
        padding: '18px',
    };

    return (
        <>
                {display && discomforts.length > 0 &&
                <>
                <span className="blue-wireframe" />
                    <div className="dashboard-container-center">
                        <div className="dashboard-container">
                            <div className="dashboard-result-container">
                                <h2>{t('DashboardResults-Your results')}</h2>
                                <h4>{t('DashboardResults-Health needs based on your quiz answers')}</h4>
                                <div style={{display: 'flex'}}>
                                    <div className="div-part-1">

                                        <div className="dashboard-result-health">
                                            <div className="dashboard-result-health-header">
                                                <h1>{t('DashboardResults-Health')}</h1>
                                                <span style={{background: "url('/images/dashboard/healthNeeds-discomfort.svg')"}}/>
                                            </div>
                                            <div className="dashboard-result-health-content">
                                                <div>
                                                    <h6>{length[0]} {t('DashboardResults-Discomforts to relieve')}</h6>
                                                    <div className="dashboard-result-health-discomforts">
                                                        <DashboardBadges arr={discomforts} type="discomfort"/>                                        
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6>{length[1]} {t('DashboardResults-Health risks to prevent')}</h6>
                                                    <div className="dashboard-result-health-preventions">
                                                        <DashboardBadges arr={preventions} type="prevention" />                                   
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        { isFull && DashboardBadges.length > 0 &&
                                        <div className="dashboard-result-lifestyle">
                                            <div className="dashboard-result-lifestyle-header">
                                                <h1>{t('DashboardResults-Lifestyle')}</h1>
                                                <span style={{background: "url('/images/dashboard/healthNeeds-lifestyle.svg')"}}/>
                                            </div>
                                            <div className="dashboard-result-lifestyle-content">
                                            {/*    
                                            
                                                    ******Lifestyle goals contenent******
                                                    
                                                    <div>
                                                        <h6>{t('DashboardResults-Health goals')}</h6>
                                                        <div className="dashboard-result-lifestyle-goals">
                                                        <DashboardHealthGoals arr={myArrayHeathGoal}/>
                                                        </div>
                                                    </div>    

                                            */}        

                                                <div>
                                                    <h6>{t('DashboardResults-Lifestyle')}</h6>
                                                    <div className="dashboard-result-lifestyle-lifestyle">
                                                        <DashboardBadges arr={discomforts} type="lifestyle"/> {/* //todo: brancher DashboardBadges sur les bonnes donnéés */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        }

                                    </div>

                                    {   isFull && 
                                            <div className="dashboard-result-nutrition">
                                                <div className="dashboard-result-nutrition-header">
                                                    <h1>{t('DashboardResults-Nutrition')}</h1>
                                                    <span style={{background: "url('/images/dashboard/healthNeeds-nutrition.svg')"}}/>
                                                </div>
                                                <div className="dashboard-result-nutrition-content">
                                                    <div>                                       
                                                        <AveragePlate />
                                                    </div>
                                                    <div className="nutrientPanel">
                                                {/* //toddo: brancher NutrienPanel sur les bonnes donnéés */}
                                                        <NutrientPanel nutrients={arrayNutrient} title={
                                                                <div>
                                                                <p className='nutritional-deficiencies-title'>{arrayNutrient.length} nutritional deficiencies</p>
                                                                <span className='nutritional-deficiencies-subtitle'> % of daily recommended intake</span>
                                                                </div>
                                                            }
                                                        />                               
                                                    </div>
                                                </div>    
                                            </div> 
                                        }
                                </div>
                            </div>
                            
                            <div className="dashboard-result-container-2">
                                <div className="dashboard-result-callaction">
                                    <button type="button" onClick={() => {
                                        setDisplay(false);
                                    }}
                                    >
                                        {t('DashboardResults-See best products for you')}
                                        <div style={{display: 'flex', marginLeft: '15px'}}>
                                            <span style={{background: 'url("/images/dashboard/arrowAnim.svg")', animation: 'moveArrow 1.3s ease-in-out infinite'}}/>
                                            <span style={{background: 'url("/images/dashboard/arrowAnim.svg")', animation: 'moveArrow_2 1.3s ease-in-out infinite'}}/>
                                        </div>
                                    </button>
                                </div>
                            </div>

                        </div> 
                    </div>
                </>}
        </>
    );
}
