import React, { useState } from "react";
import styled from "styled-components";
import {
  Wrapper,
  Head,
  ToggleBtn,
  BodyWrapper,
  Body,
  Absol,
  BottomItem,
} from "./style";

import { useMutation, useQuery } from "react-query";
import { useNavigate, Navigate } from "react-router-dom";
import { getUserInfo } from "../../../../src/store/apis/user"; //  유저정보 가져오기
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getUsercollectedInfo } from "../../../../src/store/apis/user"; //  유저정보 가져오기
import { setMusicList } from "../../stores/RoomStore";
import Chat from "../Chat";
import AudioPlayer from "../Music/AudioPlayer";
import { Tooltip } from "@mui/material";
import MusicModal from "../Music/MusicModal";
import StoreModal from "../NFTstore/StoreModal";
import VisitModal from "../visitModal";
import UserModal from "../user/UserModal";
import { EditModeChange, MakingModeChange } from "../../stores/EditStore";

const UIBar = () => {
  const [musicList, setMusic] = useState();
  const userId = useAppSelector((state) => state.edit.userId);
  const dispatch = useAppDispatch();
  const [tog, setTog] = useState(true);
  const [musicTog, setMusicTog] = useState(true);
  const [shopTog, setShopTog] = useState(true);
  const [visitTog, setVisitTog] = useState(true);
  const [userTog, setUserTog] = useState(true);

  const navigation = useNavigate();

  const {
    data: Alldata,
    isLoading: AllLoading,
    refetch: ALL,
  } = useQuery<any>(
    "ALLNFT",
    async () => {
      const size = 1000;
      return await getUsercollectedInfo(userId, size);
    },
    {
      onSuccess: (res) => {
        // 성공하면 db에 뮤직 string List를 만들어서 넘겨준다.
        let arr;
        console.log(res, "앱창에서 불러온 정보");
        const MusicArray = res.content.map((obj, i) => {
          if (obj.productCode === 1) {
            return {
              title: obj.productTitle,
              artist: obj.productDesc,
              audioSrc: obj.productFileUrl,
              image: obj.productThumbnailUrl,
              color: "#6225E6",
            };
          } else {
            return null;
          }
        });
        const result = MusicArray.filter((obj, i) => obj !== null);
        console.log(result, "새 결과");
        dispatch(setMusicList(result));
        setMusic(result);
      },
    }
  );
  const { data: userInfo, isLoading: userInfoLoading } = useQuery<any>(
    "sideuserInfo",
    async () => {
      return await getUserInfo(userId);
    }
  );

  // room 이동 요청
  // get 해당 유저의 id , 데이터 변경 , post 요청 입장, route 주소 변경
  // Ramdom 로직 확인 후 분할 혹은 병합

  const toggle = () => {
    setTog(!tog);
  };

  const gotoHome = () => {
    // return <Navigate to="/" />;
    navigation("/");
    (window as any).game.destroy(true);
  };

  const ClickModeChange = () => {
    dispatch(EditModeChange());
    console.log("변경중");
  };

  const openMusic = () => {
    setMusicTog(!musicTog);
  };

  const openShop = () => {
    setShopTog(!shopTog);
  };

  const openVisit = () => {
    setVisitTog(!visitTog);
  };

  const openUser = () => {
    setUserTog(!userTog);
  };
  return (
    <Wrapper>
      <Head className={tog ? "close" : "open"}>
        <ToggleBtn onClick={() => toggle()}>
          <img
            className={tog ? "changeButton" : "button"}
            src="/essets/room/arrow-left-circle.png"
            alt="사진없노"
          ></img>
        </ToggleBtn>
        {userInfo ? (
          <>
            <img src={userInfo.userImgUrl} alt="사진없노" />

            <div className={tog ? "hidden" : ""}>
              <div>{userInfo.userNick}</div>
              <div>follower : {userInfo.followerCnt}</div>
              <div> following : {userInfo.followeeCnt}</div>
            </div>
          </>
        ) : (
          <>로딩중..</>
        )}
      </Head>
      <BodyWrapper>
        <Body className={tog ? "close" : "open"}>
          <Absol>{shopTog ? null : <StoreModal></StoreModal>}</Absol>
          <Absol>{visitTog ? null : <VisitModal></VisitModal>}</Absol>
          <Absol>{musicTog ? null : <MusicModal></MusicModal>}</Absol>
          <Absol>{userTog ? null : <UserModal></UserModal>}</Absol>
          <div
            className="Icon"
            onClick={() => {
              openMusic();
            }}
          >
            <img className="Mimg" src="/essets/room/music.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              {musicList && <AudioPlayer tracks={musicList} />}
            </div>
          </div>
          <div className="Icon" onClick={() => ClickModeChange()}>
            <img
              className="Mimg"
              src="/essets/room/hammer.png"
              alt="사진없노"
            />
            <div className={tog ? "hidden" : "content"}>
              <p>Editing</p>
            </div>
          </div>
          <div className="Icon" onClick={() => gotoHome()}>
            <img className="Mimg" src="/essets/room/home.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              <p>Home</p>
            </div>
          </div>
          <div
            className="Icon"
            onClick={() => {
              openShop();
            }}
          >
            <img className="Mimg" src="/essets/room/store.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              <p>store</p>
            </div>
          </div>
          <div
            className="Icon"
            onClick={() => {
              openVisit();
            }}
          >
            <img className="Mimg" src="/essets/room/visit.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              <p>Guest Book</p>
            </div>
          </div>
          <div
            className="Icon"
            onClick={() => {
              openUser();
            }}
          >
            <img className="Mimg" src="/essets/room/visit.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              <p>UserList</p>
            </div>
          </div>
        </Body>
        <BottomItem className={tog ? "close" : "open"}>
          <div className="Bottom">
            <img src="/essets/room/move.png" alt="사진없노" />
            <div className={tog ? "hidden" : "content"}>
              <Tooltip title="Random User">
                <button>
                  <img className="user" src="/essets/room/random.png" alt="" />
                </button>
              </Tooltip>
              <Tooltip title="Search User">
                <button>
                  <img className="user" src="/essets/room/search.png" alt="" />
                </button>
              </Tooltip>
            </div>
          </div>
        </BottomItem>
      </BodyWrapper>
    </Wrapper>
  );
};

export default UIBar;
