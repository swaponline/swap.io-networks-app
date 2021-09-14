import React,{useState} from 'react';
import './Tabs.css';

const Tabs = ({onClickTabCallback}) => {

	const [clicked,setClicked] = useState(true)

	const onClickTab = (tab) => {
		setClicked(tab)
		onClickTabCallback(tab)
	};

	return (
		<div  className='tabs-block'>
			<div  className="tab">
				<button className={`left-button ${clicked?'selected':''}`} onClick={()=>onClickTab(true)} >INFO</button>
			</div>
			<div  className="tab">
				<button className={`right-button ${clicked?'':'selected'}`} onClick={()=>onClickTab(false)} >TEST</button>
			</div>
			
		</div>
	);
};


export default Tabs;
