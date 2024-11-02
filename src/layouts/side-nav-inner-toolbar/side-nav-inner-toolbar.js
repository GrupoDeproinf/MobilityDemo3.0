import Button from "devextreme-react/button";
import Drawer from "devextreme-react/drawer";
import ScrollView from "devextreme-react/scroll-view";
import Toolbar, { Item } from "devextreme-react/toolbar";
import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { Header, SideNavigationMenu, Footer } from "../../components";
import "./side-nav-inner-toolbar.scss";
import { useScreenSize } from "../../utils/media-query";
import { Template } from "devextreme-react/core/template";
import { useAuth } from "../../contexts/auth";
import { useMenuPatch } from "../../utils/patches";

export default function SideNavInnerToolbar({ title, children }) {
  const scrollViewRef = useRef(null);
  const navigate = useNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const { user } = useAuth();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(
    isLarge ? MenuStatus.Opened : MenuStatus.Closed
  );

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.Opened
        : MenuStatus.Closed
    );
    // event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.TemporaryOpened
        : prevMenuStatus
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus !== MenuStatus.Closed && !isLarge
        ? MenuStatus.Closed
        : prevMenuStatus
    );
    return true;
  }, [isLarge]);

  const onNavigationChanged = useCallback(
    ({ itemData, event, node }) => {
      if (menuStatus === MenuStatus.Closed || !itemData.path || node.selected) {
        event.preventDefault();
        return;
      }

      navigate(itemData.path);
      scrollViewRef.current.instance.scrollTo(0);

      if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
        setMenuStatus(MenuStatus.Closed);
        event.stopPropagation();
      }
    },
    [navigate, menuStatus, isLarge]
  );

  return (
    <div className={"side-nav-inner-toolbar"}>
      <Drawer
        className={["drawer", patchCssClass].join(" ")}
        position={"before"}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={isXSmall ? 0 : 60}
        maxSize={200}
        shading={isLarge ? false : true}
        opened={menuStatus === MenuStatus.Closed ? false : true}
        template={"menu"}
      >
        <div>
          <Header menuToggleEnabled={isXSmall} toggleMenu={toggleMenu} />
        </div>
        <div className={"container"}>
          <ScrollView ref={scrollViewRef} className={"layout-body with-footer"}>
            <div className={"content"}>
              {React.Children.map(children, (item) => {
                return item.type !== Footer && item;
              })}
            </div>
            <div className={"content-block"}>
              {React.Children.map(children, (item) => {
                return item.type === Footer && item;
              })}
            </div>
          </ScrollView>
        </div>
        <Template name={"menu"}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}
          >
            {menuStatus === MenuStatus.Closed ? (
              <div
                className="iconoMenuClose"
                onClick={(event) => toggleMenu(event)}
              >
                <button type="button" onClick={(event) => toggleMenu(event)}>
                  {/* <img src="icono.png" /> */}
                </button>
              </div>
            ) : (
              <>

                <div className="iconos">
                  <div
                    className="iconoNavbar"
                    // src="icono.png"
                    onClick={(event) => toggleMenu(event)}
                  />
                  {/* <img className="nombreIconoNavbar" src="BrandingGris.png" /> */}
                </div>
                <div className="rayaSepacionNav">
                </div>


                <div className="">
                  <div className="imgFotoNavbar">
                    <img src="icono.png" />
                  </div>

                  <div className="infoUser">
                    <img className="nombreIconoNavbar" src="BrandingGris.png" />
                  </div>

                </div>
                <div className="rayaSepacionNav"></div>
              </>
            )}

            {/* <Toolbar id={"navigation-header"}>
              {!isXSmall && (
                <Item location={"before"} cssClass={"menu-button"}>
                  <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
                </Item>
              )}
              <Item
                location={"before"}
                cssClass={"header-title"}
                text={title}
              />
            </Toolbar> */}
          </SideNavigationMenu>
        </Template>
      </Drawer>
    </div>
  );
}

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3,
};
