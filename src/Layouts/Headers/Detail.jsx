import React, {useCallback, useEffect, useRef, useState} from "react";
import {Badge} from "react-bootstrap";
import VitalsignModal from "../../component/VitalsignModal";
import styled from "styled-components";
import PropTypes from "prop-types";
import IsolationExitModal from "../../component/IsolationExitModal";
import IsolationApi from "../../Apis/IsolationApi";
import useAlert from "../../Utils/UseAlert";
import AdmissionExitModal from "../../component/AdmissionExitModal";
import VidioModal from "../../component/VidioModal";
import AdmissionApi from "../../Apis/AdmissionApi";

const HealthSignal = styled.span`
  display: inline-block;
  margin: 0 2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${props => props.value === 'Y' ? props.color : '#999'} !important;
`

const ButtonH34 = styled.button`
  height: 34px;
`

const RedSpan = styled.span`
  color: #ff2020 !important;
`

const BlueSpan = styled.span`
  color: #2094ff !important;
`

const MH83Li = styled.li`
  min-height: 83px;
`


const Detail = ({dashBoardData}) => {
    const [show, setShow] = useState(false);
    const showVitalsignModal = () => {
        setShow(true)
    }
    const hideVitalsignModal = () => {
        setShow(false)
    }

    const {alert,confirm} = useAlert();
    const searchPatientId = useRef('')
    const searchPatientNm = useRef('')
    const [searchAdmissionCenter,setSearchAdmissionCenter] = useState();
    const searchAdmissionState = useRef();
    const searchAdmissionId = useRef();
    const searchAdmissionNm = useRef();
    const searchPatientIsolation = useRef()
    const [paginationObj, setPaginationObj] = useState({currentPageNo: 1, pageSize: 10, recordCountPerPage: 15})
    const [sortedOrder,setSortedOrder] = useState({By:'',Dir:''})
    const isolationApi = new IsolationApi(searchPatientId,searchPatientNm,searchPatientIsolation,paginationObj,sortedOrder);
    // 입소자관련 Api
    const admissionApi = new AdmissionApi(searchAdmissionCenter,searchAdmissionId,searchAdmissionNm,searchAdmissionState,paginationObj,sortedOrder.By,sortedOrder.Dir);
    //재택격리자 격리해제 모달 닫기
    const handledCloseIsolationExitModal = useCallback(() =>{
        setIsolationExitModalObj({show: false, data: {}})
    },[])
    //재택격리자 격리해제 모달 열기
    const handledIsolationExitModal = (admissionId) =>{
        isolationApi.detail(admissionId).then(({data}) => setIsolationExitModalObj({show: true, data: {...data.result}}))
    };
    //재택격리자 격리해제 모달
    const [isolationExitModalObj,setIsolationExitModalObj] = useState({show:false,data: {}});
    const [video, setVideo] = useState({show:false})
    const test = ()=>{
        setVideo({show:true})
    }
    const test2 = ()=>{
        setVideo({show:false})
    }
    //생활치료센터 퇴소 모달
    const [admissionExitModalObj,setAdmissionExitModalObj] = useState({show:false,data: {}});
    //생활치료센터 퇴소 모달 열기 (admissionId 로 api 요청 하려고 인자로 받음)
/*    const handledAdmissionExitModal = (admissionId) =>{

        admissionApi.detail(admissionId).then(({data}) => setAdmissionExitModalObj({show: true, data: {...data.result}}))
    }*/
    const handledAdmissionExitModal = (admissionId) =>{
        isolationApi.detail(admissionId).then(({data}) =>{
            setSearchAdmissionCenter(dashBoardData.centerNm);
            data.result.centerNm = dashBoardData.centerNm;
            console.log(data)
            setAdmissionExitModalObj({show: true, data: {...data.result}})
        })
    }
    //생활치료센터 퇴소 모달 닫기
    const handledCloseAdmissionExitModal = useCallback(() =>{
        setAdmissionExitModalObj({show: false, data: {}})
    },[])

    /*생활치료센터 퇴소 API*/
    const discharge2 = useCallback(async (admissionId, dischargeDate,quantLocation, patientNm) => {
        if(dischargeDate===''){
            alert('퇴소일이 공백입니다.')
        }
        else{
            const confirmState = await confirm(`${patientNm} 을 퇴소처리 하시겠습니까?`)
            if(confirmState) {
/*                admissionApi.discharge(admissionId, dischargeDate, quantLocation).then(({data}) => {
                    if(data.code==='00'){
                        alert(data.message)
                        handledCloseAdmissionExitModal()
                    }
                    else{
                        alert(data.message)
                    }
                });*/
            }
        }
    },[])

    /*재택격리자 해제 API*/
    const discharge = useCallback(async (admissionId, dischargeDate, quantLocation, patientNm) => {
        if(dischargeDate===''){
            alert('격리해제일이 공백입니다.');
        }
        else{
            console.log(quantLocation);
            const confirmState = await confirm(`${patientNm} 을 퇴소처리 하시겠습니까?`);
            if(confirmState) {
                isolationApi.discharge(admissionId, dischargeDate, quantLocation).then(({data}) => {
                    if(data.code==='00'){
                        alert(data.message);

                    }
                    else{
                        alert(data.message);
                    }
                });
            }
        }
    },[])

    const {recentResultInfo} = dashBoardData;
    return (
        <>
            <div className="dashboard-info">
                <div className="row">
                    <div className="col col-4 d-flex flex-column justify-content-start">
                        <div className="current-top">
                            <div className="current-btn"  style={{marginTop: '5px'}}>
                                {
                                    dashBoardData.qantnDiv === '2' ?
                                        <ButtonH34 type="button" className="btn btn-primary">
                                            <strong>{dashBoardData.dispLocationInfo}</strong>
                                        </ButtonH34> : null
                                }
                                {
                                    dashBoardData.qantnDiv === '1' ?
                                        <ButtonH34 type="button" className="btn btn-primary"  style = {{width : "200px"}}>
                                            <strong>자택</strong>
                                        </ButtonH34> : null
                                }
                                <ButtonH34 type="button" className="btn btn-exit"
                                           disabled={dashBoardData.dschgeDate != null}
                                           onClick={dashBoardData.qantnDiv !== '2'&& dashBoardData.dschgeDate == null ? () =>handledIsolationExitModal(dashBoardData.admissionId):()=> handledAdmissionExitModal(dashBoardData.admissionId)}>
                                    <strong>{dashBoardData.qantnDiv === '2' ? '퇴소 / 전원관리' : '격리 해제 관리'}</strong>
                                </ButtonH34>
                            </div>
                            <div className={'current-info'} style={{marginTop: '5px'}}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th style={{margin: '3px'}}>
                                            <Badge className={'d-flex justify-content-center align-items-center'}
                                                   bg="success"
                                                   style={{
                                                       width: '60px',
                                                       height: '24px',
                                                       fontSize: '14px',
                                                       fontWeight: 'normal'
                                                   }}>
                                                {dashBoardData.dispDschgeInfo}
                                            </Badge>
                                        </th>
                                        <td>{dashBoardData.dispAdmissionPeriodInfo}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="head">
                                <div className="current-head">
                                    <div className="bts2 is-tooltip d-flex">
                                        {/*<HealthSignal value={dashBoardData ?'N':dashBoardData.healthSignalVO.signal1Yn} color={'#3ed06f'}/>*/}
                                        <HealthSignal value={dashBoardData.healthSignalVO?.signal1Yn} color={'#3ed06f'}/>
                                        {/*<HealthSignal value={dashBoardData ?'N':dashBoardData.healthSignalVO.signal2Yn} color={'#d03e3e'}/>*/}
                                        <HealthSignal value={dashBoardData.healthSignalVO?.signal2Yn} color={'#d03e3e'}/>
                                    </div>
                                    <h2 className="me-3">{dashBoardData.patientNm}</h2>
                                </div>
                                <div className="current-head-bottom">
                                    <span>{dashBoardData.dispNameDetailInfo}</span>
                                </div>
                            </div>
                            <div className="current-info" style={{marginTop: '5px'}}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th>생년월일</th>
                                        <td>{dashBoardData.dispBirthDateInfo}</td>
                                    </tr>
                                    <tr>
                                        <th>환자번호</th>
                                        <td>{dashBoardData.patientId}</td>
                                    </tr>
                                    <tr>
                                        <th>연락처</th>
                                        <td>{dashBoardData.dispCellPhoneInfo}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <button onClick={test}>화상채팅테스트</button>
                        </div>
                    </div>
                    <div className="col col-8">
                        <div className="row">
                            <div className="col col-lg-12 mt05">
                                <div className="card indiv">
                                    <ul className="board_list">
                                        <MH83Li className="bl_1" onClick={showVitalsignModal}>
                                            <h2>혈압</h2>
                                            <p>{recentResultInfo && recentResultInfo.bpResultDt}</p>
                                            <div>
                                                <span>{recentResultInfo && recentResultInfo.sbpResult}</span>
                                                <span> / </span>
                                                <span>{recentResultInfo && recentResultInfo.dbpResult}</span>
                                                <em> {recentResultInfo && recentResultInfo.bpUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_2" onClick={showVitalsignModal}>
                                            <h2>심박수</h2>
                                            <p>{recentResultInfo && recentResultInfo.prResultDt}</p>
                                            <div>
                                                <span>{recentResultInfo && recentResultInfo.prResult}</span>
                                                <span> / </span>
                                                <span>{recentResultInfo && recentResultInfo.prResult}</span>
                                                <em> {recentResultInfo && recentResultInfo.prUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_3" onClick={showVitalsignModal}>
                                            <h2>호흡수</h2>
                                            <p>{recentResultInfo && recentResultInfo.rrResultDt}</p>
                                            <div>
                                                {recentResultInfo && recentResultInfo.rrRiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.rrResult}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.rrRiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.rrResult}</BlueSpan>
                                                        : <span>{recentResultInfo && recentResultInfo.rrResult}</span>
                                                }
                                                <em> {recentResultInfo && recentResultInfo.rrUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_4" onClick={showVitalsignModal}>
                                            <h2>체온</h2>
                                            <p>{recentResultInfo && recentResultInfo.btResultDt}</p>
                                            <div>
                                                {recentResultInfo && recentResultInfo.btRiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.btResult.substring(0,5)}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.btRiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.btResult.substring(0,5)}</BlueSpan>
                                                        : <span>{recentResultInfo && recentResultInfo.btResult.substring(0,5)}</span>
                                                }
                                                <em> {recentResultInfo && recentResultInfo.btUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_5" onClick={showVitalsignModal}>
                                            <h2>산소포화도</h2>
                                            <p>{recentResultInfo && recentResultInfo.spResultDt}</p>
                                            <div>
                                                {recentResultInfo && recentResultInfo.spRiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.spResult}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.spRiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.spResult}</BlueSpan>
                                                        : <span>{recentResultInfo && recentResultInfo.spResult}</span>
                                                }
                                                <em> {recentResultInfo && recentResultInfo.spUnit}</em>
                                            </div>
                                        </MH83Li>
                                    </ul>
                                    <ul className="board_list">
                                        <li className="bg-none"/>
                                        <MH83Li className="bl_6 bg-none">
                                            <h2>걸음수</h2>
                                            <p>{recentResultInfo && recentResultInfo.stResultDt}</p>
                                            <div>
                                                {recentResultInfo && recentResultInfo.st1RiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.st1Result}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.st1RiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.st1Result}</BlueSpan>
                                                        : <span>{recentResultInfo && recentResultInfo.st1Result}</span>
                                                }
                                                <span> / </span>
                                                {recentResultInfo && recentResultInfo.st2RiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.st2Result}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.st2RiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.st2Result}</BlueSpan>
                                                        : <span>{recentResultInfo && recentResultInfo.st2Result}</span>
                                                }
                                                <em> {recentResultInfo && recentResultInfo.stUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_7" onClick={showVitalsignModal}>
                                            <h2>수면</h2>
                                            <p>{recentResultInfo && recentResultInfo.sleepResultDt}</p>
                                            <div>
                                                {recentResultInfo && recentResultInfo.sleepRiskGb === 'H'
                                                    ? <RedSpan>{recentResultInfo.sleepResult}</RedSpan>

                                                    : recentResultInfo && recentResultInfo.sleepRiskGb === 'L' ?
                                                        <BlueSpan>{recentResultInfo.sleepResult}</BlueSpan>
                                                        :
                                                        <span>{recentResultInfo && recentResultInfo.sleepResult}</span>
                                                }
                                                <em> {recentResultInfo && recentResultInfo.sleepUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_8" onClick={showVitalsignModal}>
                                            <h2>호흡기계 위험도</h2>
                                            <p>{recentResultInfo && recentResultInfo.respiratoryRiskResultDt}</p>
                                            <div>
                                                <span>{recentResultInfo && recentResultInfo.respiratoryRiskResult}</span>
                                                <em> {recentResultInfo && recentResultInfo.respiratoryRiskUnit}</em>
                                            </div>
                                        </MH83Li>
                                        <MH83Li className="bl_9" onClick={showVitalsignModal}>
                                            <h2>정신건강 위험도</h2>
                                            <p>{recentResultInfo && recentResultInfo.mentalRiskResultDt}</p>
                                            <div>
                                                <span>{recentResultInfo && recentResultInfo.mentalRiskResult}</span>
                                                <em> {recentResultInfo && recentResultInfo.mentalRiskUnit}</em>
                                            </div>
                                        </MH83Li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VitalsignModal show={show} handledClose={hideVitalsignModal}/>

            <VidioModal video={video} handledClose={test2}/>
            {/*자택격리자 격리해제*/}
            <IsolationExitModal isolationExitModalObj={isolationExitModalObj} handledClose={handledCloseIsolationExitModal} discharge={discharge}/>

            {/*생활치료센터 퇴소*/}
            <AdmissionExitModal admissionExitModalObj={admissionExitModalObj} handledClose={handledCloseAdmissionExitModal} discharge={discharge2}/>
          {/*  <QuarantineModal show={open} handledClose={hideVitalsignModal2} data = {dashBoardData}/>*/}
        </>
    )
}


Detail.prototype = {
    dashBoardData: PropTypes.object
}

export default Detail;