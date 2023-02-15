import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


import { Controller } from 'react-spring';
import localStorageCustom from '../../utils/localStorage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { HealthNeeds } from '../../components/dashboard/recommendation/HealthNeeds';
import { Products } from '../../components/dashboard/products';
import { Header } from '../../components';
import { SidebarBasket } from '../../components/sidebar-basket';
import { SidebarProduct } from '../../components/sidebar-product';
import useScript from '../../hooks/useScript';
import { DashboardResults } from '../../components/dashboard/dashboard-results';

import { ReloadDashboardAnimation } from '../../components/dashboard/products/ReloadDashboardAnimation';
import fetchUrl from '../../utils/fetchUrl';




export function Dashboard(props:any) {

  const [sideBarOpen, setSideBarOpen]:any = useState(undefined);
  const [productSelectioned, setProductSelectioned] = useState([]);
  const [productRecommended, setProductRecommended] = useState([]);
  const [userInformation, setUserInformation]:any = useState({});
  const [printAnimation, setPrintAnimation]:any = useState(false);
  const [isDetails, setIsDetails] = useState({isDetails: false, productId: null});
  const [healthNeedsRefresh, setHealthNeedsRefresh] = useState([]);
  const [menuOpen, setMenuOpen] = useState('');
  const [popupController, setPopupController]:any = useState();
  const apiKey = localStorageCustom.getLocalStorage('apiKey');
  const [openScientificPublication, setOpenScientificPublication] = useState(false);
  const [reloadDashboardAnimation, setReloadDashboardAnimation] = useState(false);
  const {isFull} = props;

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {

    const w = window.innerWidth;
    if (w < 1000) {
      setSideBarOpen(true);
    }
    setUserInformation(localStorageCustom.getLocalStorage('dashboard-informations'));
    switch (localStorageCustom.getLocalStorage('lang')) {
      case '1':
        i18n.changeLanguage('en');
        break;
      case '2':
        i18n.changeLanguage('fr');
        break;
      case '3':
        i18n.changeLanguage('it');
        break;
      case '4':
        i18n.changeLanguage('de');
        break;
      default:
        i18n.changeLanguage('en');
    }
  }, []);

  useEffect(() => {
    if (printAnimation) {
      const iframe:any = document.createElement('iframe');
      iframe.style.display = "none";
      const currentLang = localStorageCustom.getLocalStorage('lang');
      if (currentLang === '1') {
        iframe.src = '/pdf/ticket_english.pdf';
      } else {
        iframe.src = '/pdf/ticket_german.pdf';
      }
      document.body.appendChild(iframe);
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        window.location.href = `/assessments/kiosk/${apiKey}`;
      }, 10000);
    }
  }, [printAnimation]);


  useScript('/scripts/printAnimation.js');


  if (userInformation && userInformation.quizId) {
    return (
      <>
        { reloadDashboardAnimation &&
          <ReloadDashboardAnimation reloadDashboardAnimation={reloadDashboardAnimation} setReloadDashboardAnimation={setReloadDashboardAnimation} />
        }
        <div className="print-animation" id='lottie-print' style={{display: printAnimation ? '' : 'none'}} />
        {
        !printAnimation ?
          <>
            <DashboardResults userInformation={userInformation} isFull={isFull}/>
            {/* <SidebarProduct userInformation={userInformation} setIsDetails={setIsDetails} productRecommended={productRecommended} setProductRecommended={setProductRecommended} productSelected={productSelectioned} setProductSelectioned={setProductSelectioned} openSidebarBasket={openSidebarBasket} /> */}
            <SidebarBasket setMenuOpen = {setMenuOpen} menuOpen = {menuOpen} setHealthNeedsRefresh={setHealthNeedsRefresh} productSelected={productSelectioned} setProductSelectioned={setProductSelectioned} setPrintAnimation={setPrintAnimation}/>
            <div className="main-container">
            {sideBarOpen === undefined
              ?
                <>
                  <Header isDashboard nbProduct={productSelectioned.length} />
                  <div className='grid-container-productsNeeds' style={{ height: 'fit-content'}}>
                    <Products openScientificPublication={openScientificPublication} setOpenScientificPublication={setOpenScientificPublication} popupController={popupController} setPopupController={setPopupController} setMenuOpen = {setMenuOpen} menuOpen = {menuOpen} setHealthNeedsRefresh={setHealthNeedsRefresh} setReloadDashboardAnimation={setReloadDashboardAnimation} setIsDetails={setIsDetails} userInformation={userInformation} productSelected={{productSelectioned, setProductSelectioned, productRecommended, setProductRecommended}}/>
                    {!openScientificPublication && <HealthNeeds isFull={isFull} popupController={popupController} setPopupController={setPopupController} setMenuOpen = {setMenuOpen} healthNeedsRefresh={healthNeedsRefresh} isDetails={isDetails} userInformation={userInformation} productSelected={{productSelectioned, setProductSelectioned, productRecommended, setProductRecommended}}/>
                  }</div>
                </>
              :
                <>
                  <Header isDashboard nbProduct={productSelectioned.length} />
                  <div className="button-mobile">
                    <button type="button" onClick={(e:any) => {
                      const element = document.getElementById("sidebar");
                      element?.classList.add("active");
                      setSideBarOpen(true);
                    }} style={{position: 'relative'}} className={sideBarOpen ? 'activate' : ''}>{t('Your needs')}</button>

                    <button type="button" onClick={(e:any) => {
                      const element = document.getElementById("sidebar");
                      element?.classList.remove("active");
                      setSideBarOpen(false);
                    }} style={{position: 'relative'}} className={sideBarOpen ? '' : 'activate'}>{t('Advised Products')}</button>
                  </div>
                  <div className='grid-container-productsNeeds' style={{height: 'fit-content'}}>
                    {
                      sideBarOpen ?
                        <HealthNeeds isFull={isFull} popupController={popupController} setPopupController={setPopupController} setMenuOpen = {setMenuOpen} isDetails={isDetails} userInformation={userInformation} productSelected={{productSelectioned, setProductSelectioned, productRecommended, setProductRecommended}}/>
                      :
                        <Products popupController={popupController} setPopupController={setPopupController} setMenuOpen = {setMenuOpen} menuOpen = {menuOpen} setHealthNeedsRefresh={setHealthNeedsRefresh} setReloadDashboardAnimation={setReloadDashboardAnimation} setIsDetails={setIsDetails} userInformation={userInformation} productSelected={{productSelectioned, setProductSelectioned, productRecommended, setProductRecommended}}/>
                    }
                  </div>
                </>
              }
            </div>
          </>
        :
          <>
            <div className="print-container">
              <span className="print-container-title">{t('Thank you !')}</span><br/>
              <span className="print-container-subtitle">{t('Your receipt is being printed.')}<br />
              {t('Please present this receipt at the checkout')}<br />{t('to finalize your purchase.')}</span>
              <div className="print-container-popup">
                <span className="icon-satisfaction" />
                <span className="print-container-popup-title">{t('We wish you a pleasant day')}</span>
              </div>
            </div>
          </>
        }
        </>
    );
  }
  return (
    <></>
  )
}
