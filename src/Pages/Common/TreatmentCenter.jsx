import React, {useContext, useEffect, useRef, useState} from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import TreatmentCenterApi from "../../Apis/TreatmentCenterApi";
import ReactTable from "../../component/ReactTable";
import {AlertContext} from "../../Providers/AlertContext";
import commonCode from "../../Apis/CommonCode";

function TreatmentCenter() {
    // 헤더에 페이지 타이틀 설정
    UseSetPageTitle('생활치료센터 관리');
    const alertContext = useContext(AlertContext);
    const centerId = useRef();
    const centerNm = useRef();
    const centerLocation = useRef();
    const treatmentCenterSearchId = useRef();
    const treatmentCenterSearchNm = useRef();
    const treatmentCenterSearchHospitalNm = useRef();
    const hospitalCd = useRef();

    // 생활치료센터 Api
    const treatmentCenterApi = new TreatmentCenterApi(centerId,
                                                      centerNm,
                                                      centerLocation,
                                                      hospitalCd,
                                                      treatmentCenterSearchId,
                                                      treatmentCenterSearchNm,
                                                      treatmentCenterSearchHospitalNm);

    // React-Table Table Header
    const treatmentCenterTableColumn = [
        {Header:'치료센터ID',accessor:'centerId', styleClassName:'cid'},
        {Header:'치료센터명',accessor:'centerNm', styleClassName:'cname'},
        {Header:'위치',accessor:'centerLocation', styleClassName:'caddr text-start'},
        {Header:'병원명',accessor:'hospitalNm', styleClassName:'hname'},
    ]

    // 생활치료센터 리스트 관리
    const [treatmentCenterList, setTreatmentCenterList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);

    // Mount 시 생활치료센터 리스트 요청
    useEffect(() => {
        selectTreatmentCenter()
    }, []);

    // 생활치료센터 리스트 요청
    const selectTreatmentCenter = () => {
        treatmentCenterApi.select().then(response => setTreatmentCenterList(response.data.result));
        commonCode('CD002').then(response => setHospitalList(response.data.result));
    }

    // 생활치료센터 상세정보 요청
    const detailTreatmentCenter = (selectCenterId) => {
        treatmentCenterApi.detail(selectCenterId).then(({data}) => {
            console.log(data);
            if(data.code === '00'){
                centerId.current.value=data.result.centerId;
                centerNm.current.value=data.result.centerNm;
                centerLocation.current.value=data.result.centerLocation;
                hospitalCd.current.value=data.result.hospitalCd;
            }

        });
    }
    const createTreatmentCenter = () => {
        alertContext.setShowAlert(true);
        alertContext.setAlertContent(`${centerNm.current.value}를 생성 하시겠습니까?`);
        alertContext.setIsConfirm(true);
        alertContext.setConfirmCallback(()=>createTreatmentCenterMethod)
    }

    //생활치료센터 신규 생성
    const createTreatmentCenterMethod = () => {
        treatmentCenterApi.insert().then(({data}) =>{
            if(data.code === '00'){
                // alert('신규 생활치료센터가 생성되었습니다.');

                alertContext.setShowAlert(true);
                alertContext.setAlertTitle('알림');
                alertContext.setAlertContent('신규 생활치료센터가 생성되었습니다.');

                centerId.current.value=data.result.data.centerId;
                centerNm.current.value=data.result.data.centerNm;
                centerLocation.current.value=data.result.data.centerLocation;
                setTreatmentCenterList(data.result.list);
            }
            else{
                alertContext.setShowAlert(true);
                alertContext.setAlertTitle('알림');
                alertContext.setAlertContent('신규 생활치료센터가 생성에 실패했습니다.');
            }
        }).catch((e)=>console.log(e));
    }


    const updateTreatmentCenter = () => {
        alertContext.setShowAlert(true);
        alertContext.setAlertContent(`[${centerId.current.value}] ${centerNm.current.value}를 수정하시겠습니까?`);
        alertContext.setIsConfirm(true);
        alertContext.setConfirmCallback(()=>updateTreatmentCenterMethod)

    }

    //생활치료센터 수정
    const updateTreatmentCenterMethod = () => {
        treatmentCenterApi.update().then(({data}) =>{
            if(data.code === '00'){
                alertContext.setShowAlert(true);
                alertContext.setAlertContent('생활치료센터가 수정 되었습니다.');
                setTreatmentCenterList(data.result.list);
            }
            else{
                alertContext.setShowAlert(true);
                alertContext.setAlertContent('생활치료센터가 수정에 실패했습니다.');
            }
        }).catch((e)=>console.log(e));
    }

    const deleteTreatmentCenter = () => {
        // 생활치료센터 Id가 공백인지 체크
        if(!centerId.current.value) {
            alertContext.setShowAlert(true);
            alertContext.setAlertContent('생활치료센터를 선택해주세요.');
        }
        else{
            alertContext.setShowAlert(true);
            alertContext.setAlertContent(`[${centerId.current.value}] ${centerNm.current.value}를 삭제하시겠습니까?`);
            alertContext.setIsConfirm(true);
            alertContext.setConfirmCallback(()=>deleteTreatmentCenterMethod)
        }
    }
    //생활치료센터 삭제
    const deleteTreatmentCenterMethod = () => {
        treatmentCenterApi.delete().then(({data}) =>{
            if(data.code === '00'){
                alertContext.setShowAlert(true);
                alertContext.setAlertContent('생활치료센터가 삭제 되었습니다.');
                setTreatmentCenterList(data.result);
            }
            else{
                alertContext.setShowAlert(true);
                alertContext.setAlertContent('생활치료센터가 삭제에 실패했습니다.');
            }
        }).catch((e)=>console.log(e));
    }

    // 생활치료센터Id 존재 여부에 따라 신규 생성 또는 수정
    const save = () => {
        console.log(hospitalCd.current.value);
        // 생활치료센터 명이 공백인지 체크
        if(!centerNm.current.value){
            alertContext.setShowAlert(true);
            alertContext.setAlertContent('생활치료센터 명이 공백입니다.');
        }
        // 생활치료센터 위치가 공백인지 체크
        else if(!centerLocation.current.value){
            alertContext.setShowAlert(true);
            alertContext.setAlertContent('생활치료센터 위치가 공백입니다.');
        }
        else if(hospitalCd.current.value === '선택'){
            alertContext.setShowAlert(true);
            alertContext.setAlertContent('병원을 선택해주세요.');
        }
        else{
            if(centerId.current.value){

                updateTreatmentCenter(); // 업데이트
            }
            else{
                createTreatmentCenter(); // 신규
            }
        }
    }

    // 신규 (Clear)
    const clear = () => {
        centerId.current.value='';
        centerNm.current.value='';
        centerLocation.current.value='';
    }

    // 검색 Input Enter 이벤트
    const handledOnSearch = (e) =>{
        if(e.keyCode === 13){
            selectTreatmentCenter();
        }
    }
    return (
        <main className="flex_layout_2col">
            <div className="row">
                <div className="col col-lg-8">
                    <div className="card indiv">
                        <div className="card-content">
                            <div className="table-responsive">
                                <div className="table-header">
                                    <form>
                                        <div className="d-flex clear">
                                            <div className="tbl_title">생활치료센터 리스트</div>
                                            <div className="me-3 d-flex">
                                                <span className="stit">치료센터ID</span>
                                                <input className="form-control w80"
                                                       type="text"
                                                       maxLength="4"
                                                       ref={treatmentCenterSearchId}
                                                       defaultValue={''}
                                                       onKeyUp={(e)=>handledOnSearch(e)}
                                                />
                                            </div>
                                            <div className="me-3 d-flex">
                                                <span className="stit">치료센터명</span>
                                                <input className="form-control w120"
                                                       type="text"
                                                       maxLength="100"
                                                       ref={treatmentCenterSearchNm}
                                                       defaultValue={''}
                                                       onKeyUp={(e)=>handledOnSearch(e)}
                                                />
                                            </div>
                                            <div className="me-1 d-flex">
                                                <span className="stit">병원명</span>
                                                <input className="form-control w120"
                                                       type="text"
                                                       maxLength="100"
                                                       ref={treatmentCenterSearchHospitalNm}
                                                       defaultValue={''}
                                                       onKeyUp={(e)=>handledOnSearch(e)}
                                                />
                                            </div>
                                            <div className="ms-auto btn_wrap">
                                                <button type="button" className="btn btn-gray" onClick={selectTreatmentCenter}>검색</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="table-body height100">
                                    <ReactTable tableHeader={treatmentCenterTableColumn} tableBody={treatmentCenterList} trOnclick={detailTreatmentCenter}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-lg-4 wd100-mt20">
                    <div className="card indiv">
                        <form>
                            <div className="card-content">
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="d-flex">
                                            <div className="tbl_title nobar">상세정보</div>
                                            <div className="ms-auto">
                                                <div className="btn_wrap d-flex">
                                                    <button type="button" className="btn btn-wgray" onClick={deleteTreatmentCenter}>삭제</button>
                                                    <button type="button" className="btn btn-white btn-new" onClick={clear}>신규</button>
                                                    <button type="button" className="btn btn-ccolor" onClick={save}>저장</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-body">
                                        <table className="table table-borderless mt-3 text-import">
                                            <tbody>
                                            <tr>
                                                <th>생활치료센터ID</th>
                                                <td className="cid">
                                                    <input className="form-control w-100" type="text"
                                                           maxLength="4"
                                                           ref={centerId}
                                                           readOnly/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>생활치료센터 명</th>
                                                <td className="cname">
                                                    <input className="form-control w-100" type="text" maxLength="100" ref={centerNm}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>생활치료센터 위치</th>
                                                <td className="caddr">
                                                    <textarea className="form-control w-100 h60" maxLength="500" ref={centerLocation}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>병원</th>
                                                <td className="hname">
                                                    <select className="form-select w-100" ref={hospitalCd}>
                                                        <option defaultValue={''}>선택</option>
                                                        {hospitalList.map(value =>
                                                            <option value={value.detailCd}
                                                                    key={value.detailCd}>
                                                                {value.detailCdNm}
                                                            </option>
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TreatmentCenter;