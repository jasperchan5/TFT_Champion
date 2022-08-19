import instance from "./axios"
import { useEffect, useState } from 'react'
import $ from 'jquery';
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useNavigate } from 'react-router-dom';
import './App.css';
import useQuery from './useQuery';

export default () => {
    const navigate = useNavigate();
    let currSetIndex = '0';
    let displayMode = "all";
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
        displayMode = queryStr.displayMode;
    }
    catch(e){}

    const SetTabs = () => {
        const [value,setvalue] = useState(currSetIndex);
        const handleChange = (_,e) => {
            setvalue(e);
            navigate({search: `?displayMode=bySet&setIndex=${e}`})
        };
        return (
            <Box sx={{ width: '80%', typography: 'body1', margin: "auto", display: "flex", alignItems: "center" }}>
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
    const [TFTData,setTFTData] = useState([]);
    const [champions,setChampions] = useState([]);
    const [championNames,setChampionNames] = useState([]);
    useEffect(() => {
        const fetchTFTData = async() => {
            await instance.get('/api/getData').then((response) => {
                setChampionNames(Object.keys(response.data));
                setTFTData(response.data);
            })
            $.getJSON("http://ddragon.leagueoflegends.com/cdn/12.15.1/data/en_US/champion.json", (result) => {
                setChampions(result.data);
            })
        }
        fetchTFTData();
    },[])
    const ChampionRender = () => {
        const ChampionCell = ({name}) => {
            let processedName = name;
            if(processedName.match(/\w+[']{1}\w+/)){
                processedName = processedName.split("'").join().replace(",","");
            }
            else if(processedName.match(/\w[ ]{1}\w/)){
                processedName = processedName.split(" ").join().replace(",","");
            }
            const currentSet = set[parseInt(currSetIndex)].text.replace(" ","_").toLowerCase();
            if(displayMode === 'bySet'){
                const exist = Object.keys(TFTData[name]).indexOf(currentSet) !== -1;
                let skin = "";
                if(TFTData[name][currentSet] !== undefined){
                    skin = TFTData[name][currentSet].skin || "";
                }
                return (
                    <div className="champion_cell" style={{display: exist ? "flex" : "none"}}>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${processedName}.png`}/>
                        <div>{name}</div>
                        <div>{skin}</div>
                    </div>
                )
            }
            else if(displayMode === 'all'){
                return (
                    <div className="champion_cell">
                        <img src={`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${processedName}.png`}/>
                        <div>{name}</div>
                    </div>
                )
            }
        }
        return (
            <>
                <Box sx={{ width: "80%", margin: "24px auto 24px auto", display: "grid", rowGap: "12px", gridTemplateColumns: "repeat(8,1fr)"}}>
                    {championNames.map((e) => <ChampionCell name={e}/>)}
                </Box>
            </>
        )
    }
    const TabRender = () => {
        switch (displayMode) {
            case 'all':
                return <div className="all" onClick={() => navigate({search: `?displayMode=all`})}>All</div>
            case 'bySet':
                return <>
                    <div className="all" onClick={() => navigate({search: `?displayMode=all`})}>All</div>
                    <SetTabs/>
                </>
            default:
                break;
        }
    }
    return (
        <div id="Body">
            
            <div className="all" onClick={() => navigate({search: `?displayMode=bySet&setIndex=${0}`})}>By Set</div>
            <TabRender/>
            <ChampionRender/>
        </div>
    )
}