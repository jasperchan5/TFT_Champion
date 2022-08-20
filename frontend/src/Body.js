import instance from "./axios"
import { useEffect, useState } from 'react'
import $ from 'jquery';
import { Box, Tab, Collapse } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useNavigate } from 'react-router-dom';
import './App.css';
import useQuery from './useQuery';

export default () => {
    const navigate = useNavigate();
    let currSetIndex = '0';
    const [displayMode,setDisplayMode] = useState(localStorage.getItem("displayMode") || "all");
    const set = [
        {text: 'Set 1', value: '0'},
        {text: 'Set 2', value: '1'},
        {text: 'Set 3', value: '2'},
        {text: 'Set 3.5', value: '3'},
        {text: 'Set 4', value: '4'},
        {text: 'Set 4.5', value: '5'},
        {text: 'Set 5', value: '6'},
        {text: 'Set 5.5', value: '7'},
        {text: 'Set 6', value: '8'},
        {text: 'Set 6.5', value: '9'},
        {text: 'Set 7', value: '10'}
    ];
    const queryStr = useQuery();
    try{
        currSetIndex = queryStr.setIndex.toString();
    }
    catch(e){}

    const [TFTData,setTFTData] = useState([]);
    const [champions,setChampions] = useState({});
    const [championNames,setChampionNames] = useState([]);
    useEffect(() => {
        const fetchTFTData = async() => {
            await instance.get('/api/getData').then((response) => {
                setChampionNames(Object.keys(response.data));
                setTFTData(response.data);
            })
            $.getJSON("http://ddragon.leagueoflegends.com/cdn/12.15.1/data/en_US/champion.json", (result) => {
                console.log(result.data);
                const resultKeys = Object.keys(result.data);
                const lowerCaseKeys = resultKeys.map((e) => e.toLowerCase());
                resultKeys.forEach((e,i) => {
                    result.data[lowerCaseKeys[i]] = result.data[e];
                    delete result.data[e];
                })
                result.data["wukong"] = result.data["monkeyking"];
                delete result.data["monkeyking"];
                result.data["nunu & willump"] = result.data["nunu"];
                delete result.data["nunu"];
                setChampions(result.data);
            })
        }
        fetchTFTData();
    },[])

    useEffect(() => {
        if(displayMode === 'all'){
            document.getElementsByClassName("all")[0].classList.add("selected");
            document.getElementsByClassName("bySet")[0].classList.remove("selected");
        }
        else if(displayMode === 'bySet'){
            document.getElementsByClassName("bySet")[0].classList.add("selected");
            document.getElementsByClassName("all")[0].classList.remove("selected");
        }
    })

    const SetTabs = () => {
        const [value,setvalue] = useState(currSetIndex);
        const handleChange = (_,e) => {
            setvalue(e);
            navigate({search: `?setIndex=${e}`})
        };
        return (
            <Box sx={{ width: '80%', typography: 'body1', margin: "24px auto 12px auto", display: "flex", alignItems: "center" }}>
                <TabContext value={value}>
                    <Box sx={{ width: "100%", borderColor: 'divider' }}>
                        <TabList centered={true} TabIndicatorProps={{style: {background: "#202325", height: "2px"}}} onChange={handleChange} aria-label="lab API tabs example">     
                            {set.map((e,i) => 
                                <Tab key={i} style={{color: "#202325"}} label={e.text} value={e.value} />
                            )}
                        </TabList>
                    </Box>
                </TabContext>
            </Box>
        )
    }
    const ChampionRender = () => {
        const ChampionCell = ({name}) => {
            let processedName = name;
            if(processedName.match(/\w+[']{1}\w+/)){
                processedName = processedName.split("'").join().replace(",","");
            }
            else if(processedName.match(/\w[ ]{1}\w/) && processedName !== 'Renata Glasc'){
                processedName = processedName.split(" ").join().replace(",","");
            }
            else if(processedName.match(/\w[.]{1}[ ]{1}\w/)){
                processedName = processedName.replace(" ","").split(".").join().replace(",","");
            }
            const currentSet = set[parseInt(currSetIndex)].text.replace(" ","_").toLowerCase();
            processedName = processedName.toLowerCase();
            if(processedName === 'renata glasc'){
                processedName = 'renata';
            }
            const exist = Object.keys(TFTData[name]).indexOf(currentSet) !== -1;
            try{
                if(displayMode === 'bySet'){
                    let skin = "";
                    let origin = [];
                    let classes = [];
                    if(TFTData[name][currentSet] !== undefined){
                        skin = TFTData[name][currentSet].skin;
                        origin = TFTData[name][currentSet].origin;
                        classes = TFTData[name][currentSet]["class"];
                    }
                    return (
                        <div className="champion_cell" style={{display: exist ? "flex" : "none"}}>
                            <img width={96} height={96} src={`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${champions[processedName].image.full}`}/>
                            <div>{name}</div>
                            <div style={{fontSize: "14px", color: "#AD1546"}}>{skin}</div>
                            {origin.map((e) => <div style={{fontSize: "14px", color: "#72777A"}}>{e}</div>)}
                            {classes.map((e) => <div style={{fontSize: "14px", color: "#72777A"}}>{e}</div>)}
                        </div>
                    )
                }
                else if(displayMode === 'all'){
                    return (
                        <div className="champion_cell">
                            <img width={96} height={96} src={`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${champions[processedName].image.full}`}/>
                            <div>{name}</div>
                        </div>
                    )
                }
            }
            catch(e){
                if(exist){
                    let skin = "";
                    let origin = [];
                    let classes = [];
                    if(TFTData[name][currentSet] !== undefined){
                        skin = TFTData[name][currentSet].skin;
                        origin = TFTData[name][currentSet].origin;
                        classes = TFTData[name][currentSet]["class"];
                    }
                    return (
                        <div className="champion_cell">
                            <img width={96} height={96} src={`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/spell/SummonerMana.png`}/>
                            <div>{name}</div>
                            {origin.map((e) => <div style={{fontSize: "14px", color: "#72777A"}}>{e}</div>)}
                            {classes.map((e) => <div style={{fontSize: "14px", color: "#72777A"}}>{e}</div>)}
                        </div>
                    )
                }
            }
        }
        return (
            <>
                <Box sx={{ width: "80%", margin: "24px auto 24px auto", display: "grid", rowGap: "12px", gridTemplateColumns: "repeat(6,1fr)"}}>
                    {championNames.map((e) => <ChampionCell name={e}/>)}
                </Box>
            </>
        )
    }
    return (
        <div id="Body">
            <Box sx={{width: "80%", height: "48px", display: "flex", margin: "auto", justifyContent: "space-around", alignItems: "center"}}>
                <div className="all" onClick={() => {
                    setDisplayMode("all");
                    localStorage.setItem("displayMode","all");
                }}>All</div>
                <div className="bySet" onClick={() => {
                    setDisplayMode("bySet");
                    localStorage.setItem("displayMode","bySet");
                }}>By Set</div>
            </Box>
            {displayMode === 'bySet' ? <SetTabs/> : <></>}
            <ChampionRender/>
        </div>
    )
}