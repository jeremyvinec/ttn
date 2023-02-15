import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fetchUrl from '../../../utils/fetchUrl';
import { Packs } from '../packs';
import localStorageCustom from '../../../utils/localStorage';
import { ProductCardsPopup } from './ProductCards/ProductCardsPopup';
import conf from "../../../conf.json";
import { ProductCards } from './ProductCards';
import './style.css';
import { PopupScientific } from '../recommendation/popup-scientific';

export function Products(props: any) {

  const { t } = useTranslation();
  const { productSelected, userInformation, pharmacyId, setIsDetails, setReloadDashboardAnimation, setHealthNeedsRefresh,setMenuOpen, menuOpen, popupController, setPopupController, openScientificPublication, setOpenScientificPublication } = props;
  const { productSelectioned, setProductSelectioned, productRecommended, setProductRecommended } = productSelected;

  const [recoProducts, setRecoProducts] = useState<any[]>([]);
  const [scientificPublicationsNumber, setScientificPublicationsNumber]:any = useState(0);

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayDashboard, setOverlayDashboard] = useState(false);

  const lang = localStorageCustom.getLocalStorage('lang');
  const params = useParams();

  const overlayAddCart = (productData: any) => {
    // callBack(productData);
    setOverlayOpen(true);
  }

  const openSidebarProduct = async (productData:any) => {

    const element_2 = document.getElementById(productData.id_product) as any;
    element_2.style.zIndex = "1000";
    if (element_2.style.zIndex !== "1000") {
      return;
    }
    setHealthNeedsRefresh((arr:any) => [...arr, productData]);
    setOverlayDashboard(true);

    // get all unique product id and put it in a string
    const uniqueProducts = productSelected.productSelectioned.map((product:any) => product.id_product);
    uniqueProducts.push(productData.id_product);
    const uniqueProductsString = uniqueProducts.filter((item:any, index:any) => uniqueProducts.indexOf(item) === index).join(',');
    const recommendedProducts = await fetchUrl(`${confSERVER}_occurrences=5`);
    for (let i = 0; i < recommendedProducts.length; i += 1) {
      recommendedProducts[i].prices = {
          "price": recommendedProducts[i].products[0].formats[0].price.toFixed(2),
          "promotional_price": recommendedProducts[i].products[0].formats[0].promotional_price.toFixed(2),
      }
    }
    productSelected.setProductRecommended(recommendedProducts);

    setTimeout(() => {
      setReloadDashboardAnimation(true);
    }, 3000)
    setTimeout(() => {
      setOverlayDashboard(false);
      element_2.style.zIndex = "1";
    }, 5000)

    recommendedProducts.forEach((element:any) => {
      element.products[0].quantity = 0;
      element.products[0].score = Math.max(Math.min(element.score, 100), 0);
      element.products[0].formats[0].price = parseFloat(element.products[0].formats[0].price).toFixed(2).toString();
      element.products[0].formats[0].promotional_price = parseFloat(element.products[0].formats[0].promotional_price).toFixed(2).toString();
      element.products[0].prices = {
        "price": element.products[0].formats[0].price > 0 ? element.products[0].formats[0].price : null,
        "promotional_price": element.products[0].formats[0].promotional_price > 0 ? element.products[0].formats[0].promotional_price : null,
      };
      element.products[0].health_effects = element.health_effects;
      element.products[0].composition = element.composition;


      if (element.health_effects.discomforts) {
        element.products[0].health_effects.discomforts = {
          "cs": element.health_effects.discomforts.cs ?? [],
          "ss": element.health_effects.discomforts.ss ?? []
        };
        element.products[0].health_effects.discomforts.total = element.products[0].health_effects.discomforts.cs.concat(element.products[0].health_effects.discomforts.ss);
      }
      if (element.health_effects.preventions) {
        element.products[0].health_effects.preventions = {
            "health_risks": element.health_effects.preventions.health_risks ? element.health_effects.preventions.health_risks : [],
            "prevents": element.health_effects.preventions.prevents ? element.health_effects.preventions.prevents : []
        }
        element.products[0].health_effects.preventions.total = element.products[0].health_effects.preventions.health_risks.concat(element.products[0].health_effects.preventions.prevents);
      }
    });

    setTimeout(() => {
      productSelected.setProductSelectioned((arr:any) => [...arr, productData]);
    }, 4000);

  }

  useEffect(() => {
    const uniqueProducts = productSelected.productSelectioned.map((product:any) => product.id_product);
    const uniqueProductsString = uniqueProducts.filter((item:any, index:any) => uniqueProducts.indexOf(item) === index).join(',');
    fetchUrl(`${conf.SERVER_URL}pdt`, undefined, userInformation.quizId).then((res:any) => {
      res.forEach((element:any) => {
        element.products[0].quantity = 0;
        element.products[0].score = Math.max(Math.min(element.score, 100), 0);
        element.products[0].formats[0].price = parseFloat(element.products[0].formats[0].price).toFixed(2).toString();
        element.products[0].formats[0].promotional_price = parseFloat(element.products[0].formats[0].promotional_price).toFixed(2).toString();
        element.products[0].prices = {
          "price": element.products[0].formats[0].price > 0 ? element.products[0].formats[0].price : null,
          "promotional_price": element.products[0].formats[0].promotional_price > 0 ? element.products[0].formats[0].promotional_price : null,
        };
        element.products[0].health_effects = JSON.parse(JSON.stringify(element.health_effects));
        element.products[0].composition = JSON.parse(JSON.stringify(element.composition));

        // concat in total discomforts.cs and discomforts.ss and put none if not defined
        if (element.health_effects.discomforts) {
          const discomforts = {
            "cs": element.products[0].health_effects.discomforts.cs ? element.health_effects.discomforts.cs : [],
            "ss": element.products[0].health_effects.discomforts.ss ? element.health_effects.discomforts.ss : []
          };
          element.products[0].health_effects.discomforts.total = discomforts.cs.concat(discomforts.ss);

        }
        if (element.health_effects.preventions) {
          element.products[0].health_effects.preventions = {
              "health_risks": element.products[0].health_effects.preventions.health_risks ? element.health_effects.preventions.health_risks : [],
              "prevents": element.products[0].health_effects.preventions.prevents ? element.health_effects.preventions.prevents : []
          }
          element.products[0].health_effects.preventions.total = element.products[0].health_effects.preventions.health_risks.concat(element.products[0].health_effects.preventions.prevents);
        }
      });

      setRecoProducts(res.slice(0, 50));
    });
  } ,[productSelected]);


  useEffect(() => {
    fetchUrl(`${conf.SERVER_URL}quiz`).then((data:any) => {
      const efsaNb = data.total_pages * 10;
      fetchUrl(`${conf.SERVER_URL}size=10`).then((data2:any) => {
        setScientificPublicationsNumber(data2.total_pages * 10 + efsaNb);
      });
    });
    setScientificPublicationsNumber(100);
  }, []);



const productDataPopupFct2 = ( product_id:any) => {
   /* il faut chercher la donnée du pop-up soit dans productSelected soit dans productRecommended */
  return productSelectioned.find((obj:any) => obj.id_product === product_id ) || recoProducts.find ((obj:any) => obj.products[0].id_product=== product_id )?.products[0] || undefined;
}

const productDataPopup = productDataPopupFct2(menuOpen.id);

  return (
    <>
      { openScientificPublication &&
        <PopupScientific quizId={userInformation.quizId} handleClose={setOpenScientificPublication} userInformation={userInformation}/>
      }
      { !openScientificPublication &&
      <div className="products-container">
          <div className="products-card-container">
          <h1 className="banner-products">{t('Products-Best Products matching your needs')}
          <div className="recommendation-div">
                <h3 className="recommendation-subtitle">{t('Products-Based on your answers &')} <span onClick={() => setOpenScientificPublication(true)}>{scientificPublicationsNumber} {t('Products-scientific publications')}</span></h3>
              </div></h1>
          <Packs popupController={popupController} setPopupController={setPopupController}  setHealthNeedsRefresh={setHealthNeedsRefresh} setReloadDashboardAnimation={setReloadDashboardAnimation} setIsDetails={setIsDetails} userInformation={userInformation} productSelected={{productSelectioned, setProductSelectioned, setProductRecommended, productRecommended}} />
          <h1 className="big-title">{t('Products-More products matching your needs')}</h1>
            <div className="background-productgrid"/>
            <div className="productcard-grid">
              {recoProducts && recoProducts.map((product:any, index:any) => (
                <ProductCards
                  setHealthNeedsRefresh={setHealthNeedsRefresh}
                  userInformation={userInformation}
                  idProduct={index}
                  data={product.products[0]}
                  productSelected={{productSelectioned, setProductSelectioned, productRecommended, setProductRecommended}}
                  setIsDetails={setIsDetails}
                  setReloadDashboardAnimation={setReloadDashboardAnimation}
                  setMenuOpen = {setMenuOpen}
                  menuOpen = {menuOpen}
                  openSidebarProduct = {openSidebarProduct}
                  overlayDashboard = {overlayDashboard}
                />

              ))

              }
            </div>
          </div>
      </div>}
          {
          menuOpen &&
              <ProductCardsPopup productData={productDataPopup}  popupDatas={productDataPopup} menuOpen={menuOpen} setMenuOpen={setMenuOpen} productCallback={openSidebarProduct} />
            }
    </>
  );
}
