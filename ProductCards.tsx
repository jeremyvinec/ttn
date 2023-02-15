import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './style.css';
import { DropdownPacksCard } from '../../packs/DropdownPacksCard';
import { BannerBenefits } from '../../banner-benefits';
import { CardsPrice } from '../../cards-prices';
import { PopupInformations } from '../../popup-informations';
import { ProductCardsPopup } from './ProductCardsPopup';
import fetchUrl from '../../../../utils/fetchUrl';
import { nextProducts } from '../../data';
import localStorageCustom from '../../../../utils/localStorage';

export function ProductCards(props: any) {
  const [isInformationsOpen, setisInformationsOpenOpen] = useState(false);
  // const [menuOpen, setMenuOpen] = useState('');
  // Le state menu open doit être remonté pour être utilisé au niveau productCard et Siderbarbasket
  const [quantitiesMenuOpen, setQuantitiesMenuOpen] = useState(false);


  const { overlayDashboard,openSidebarProduct, setMenuOpen, menuOpen,setHealthNeedsRefresh, productSelected, data, callBack, idProduct, userInformation, setMenuOpenSidebar, setIsDetails, setReloadDashboardAnimation } = props;

  const { t } = useTranslation();


  const openQuantitiesMenu = () => {
    setQuantitiesMenuOpen(true);
  }

  const lang = localStorageCustom.getLocalStorage('lang');

  const ClickToOpenMenuAndSetState = () => {
    setMenuOpen({tab:'compositions', id:data.id_product});
    setIsDetails({
        isDetails: true,
        idProduct: data.id_product,
      });


  }


  useEffect(() => {
    if (menuOpen) {
      // setIsDetails({
      //   isDetails: true,
      //   idProduct: data.id_product,
      // });
    } else {
      setIsDetails({
        isDetails: false,
        idProduct: '',
      });
    }
  }, [menuOpen]);


  return (
    <>
      { overlayDashboard &&
      <>
          <div className="custom-overlay-scientific" style={{zIndex: 1337, background: 'transparent', width: '70vw'}}/>
          <div className="custom-overlay-scientific"/>
      </>
      }
      <div className="product-card" id={data.id_product}>
        { quantitiesMenuOpen &&
          <div className="quantities-wireframe">
            <span
              className="crossbar-sidebar"
              style={{position: 'absolute', right: '20px', top: '15px', cursor: 'pointer'}}
              onClick={() => setQuantitiesMenuOpen(false)}
            />
            <div className="product-names" style={{height: '20px'}}>
              {/* <p>{ data.name.length > 30 ? `${`${data.name.slice(0, 30)  }...`}` : data.name }</p> */}
              <p>{ data.name }</p>
            </div>
            {
              data.quantities.map((quantity:any, index:any) =>
              <div style={{position: 'relative'}}>
                <div className="product-card-tiny">
                  <div className="product-image-tiny" style={{backgroundImage: data.image ? `url(https://lala/${data.image})` : `url(/images/unclassified.png)` }}/>
                  <span>{quantity.name}</span>
                </div>
                <CardsPrice priceData={data.prices} callBack={openSidebarProduct} productData={data} />
                {index === 0 &&
                  <div className="divider" style={{width: '90%', margin: 'auto', marginTop: '20px'}}/>
                }
              </div>
              )
            }
          </div>
        }
        <DropdownPacksCard isAlert={data.alert} score={data.score} setMenuOpen={setMenuOpen}/>
        <div className="product-main" onClick={ClickToOpenMenuAndSetState}>
          <div className="product-image" style={{backgroundImage: data.image ? `url(https://lala/${data.image})` : `url(/images/unclassified.png)` }}/>
          <div className="product-names">
            <p>{ data.name }</p>
            <span>{ data.brand }</span>
          </div>
        </div>
        <div className="product-informations">
          { data && data.health_effects && (data.health_effects.discomforts || data.health_effects.preventions) &&
          <>
              <BannerBenefits idProduct={idProduct} product={data} id={2} setMenuOpen={setMenuOpen}/>
              { data.formats && data.formats.length > 1
                ?
                <CardsPrice id={1} priceData={data.prices} callBack={openQuantitiesMenu} />
                :
                <CardsPrice id={1} priceData={data.prices} callBack={openSidebarProduct} productData={data} />
              }
          </>
          }
        </div>
        { data.alert &&
        <div onClick={() => {setisInformationsOpenOpen(!isInformationsOpen)}} style={{position: 'absolute', top: '30px', left: '15px', lineHeight: '10px'}}>
          <span className="product-alerts-icon"/>
          <span className="product-alerts-text">{ data.alerts.length } {t('ProductCards-alerts')}</span>
          { isInformationsOpen &&
            <PopupInformations isDanger />
          }
        </div>
        }
      </div>
      {/* { menuOpen && (menuOpen.id === data.id_product) &&
        <ProductCardsPopup productData={data} isAlert={data.alerts} popupDatas={data} menuOpen={menuOpen} setMenuOpen={setMenuOpen} productCallback={openSidebarProduct} />
      }  */}

    </>
  );
}
