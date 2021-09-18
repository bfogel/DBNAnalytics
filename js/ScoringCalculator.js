
var mSystemLabelAverages=[];
var mFixedSystems=[];
var mSystemGroups=[];
var mCenterCounts=[3,3,3,3,3,4,3];
var mElims=[1904,1904,1904,1904,1904,1904,1904];
var mVotedOut=[false,false,false,false,false,false,false];
var mShowScoreType=1;

function DebugPrint(s) {
    document.getElementById('debug').innerHTML = s;
}

function SetUpSystems(){
    
    var group=[];
    group.push(["DSS", 1/7, CalculateDSS ]);
    group.push(["Dixie", 590/7, CalculateDixie ]);
    mSystemGroups.push(["Draw-focused",group]);

    group=[];
    group.push(["PPSC", 34/7, CalculatePPSC ]);
    group.push(["SoS", 100/7, CalculateSoS ]);
    group.push(["Manor", 13.63, CalculateManorCon ]);
    mSystemGroups.push(["Center-focused",group]);

    group=[];
    group.push(["Carnage", 28034/7, CalculateCarnage ]);
    group.push(["CDiplo", 100/7, CalculateCDiplo ]);
    mSystemGroups.push(["Rank-focused",group]);

    group=[];
    group.push(["WorldClassic", 78.011, CalculateWorldClassic ]);
    group.push(["Bangkok", 8.82967, CalculateBangkok ]);
    group.push(["Whipping", 59.8578, CalculateWhipping ]);
    mSystemGroups.push(["Hybrid",group]);

    group=[];
    group.push(["Tribute", 100/7, CalculateTribute]);
    var ot = MakeOT(3,1,true);
    ot[0]="OpenTribute";
    group.push(ot);
    mSystemGroups.push(["Tributary",group]);
    group.push(["MindTheGap", 100/7, CalculateMindTheGap]);

    mSystemGroups.forEach(gg=>{
       gg[1].forEach(x=>mFixedSystems.push(x)) 
    });


}

function MakeOT(pC, pShareType, pSpoilVanquished){
    var lbl="OT"+ pC + (pSpoilVanquished ? '':'e');
    switch(pShareType){
        case 0: lbl+="+"; break;
        case 2: lbl+="-"; break;
        default: break;
    }

    return [lbl
            , (pC+6)*34/7 - (pSpoilVanquished ? 1 : 0 )
            , () => CalculateOpenTribute(pC, pShareType, pSpoilVanquished)
            ];
}

function UpdateDisplay(){
    
	var scores = [];
	mSystemLabelAverages.forEach(x => scores.push(x[2]()));

    var displayscores=new Array(scores.length);
    for (si = 0; si<displayscores.length; si++){
        displayscores[si] = new Array(scores[si].length);
        for (i = 0; i < mCenterCounts.length; i++) { 
            displayscores[si][i] = scores[si][i];
        }
    }

    var maxdecs=0;
    var suffix="";

    switch(mShowScoreType){
        case 0: //Show as multiples of A
            maxdecs=2;
            suffix=" A";
            document.getElementById("btnToggleAverage").innerHTML='Show absolute scores';
            document.getElementById("spnLegend").innerHTML='Scores shown in terms of the overall average (A)';            

            for (si = 0; si<displayscores.length; si++){
                for (i = 0; i < mCenterCounts.length; i++) { 
                    displayscores[si][i] /= mSystemLabelAverages[si][1];
                }
            }
            break;
            
        case 1: //Show absolute
            maxdecs=1;
            suffix="";
            document.getElementById("btnToggleAverage").innerHTML='Show as percentage of avg total';
            document.getElementById("spnLegend").innerHTML='';
            break;

        case 2: //Show as a percentage of 7*A
            maxdecs=1;
            suffix="%";
            document.getElementById("btnToggleAverage").innerHTML='Show scores relative to average';
            document.getElementById("spnLegend").innerHTML='Scores shown as percentages of the average total';            

            for (si = 0; si<displayscores.length; si++){
                for (i = 0; i < mCenterCounts.length; i++) { 
                    displayscores[si][i] /= 7*mSystemLabelAverages[si][1]/100;
                    // displayscores[si][i] = Math.round(displayscores[si][i]); 
                }
            }
            break;
        
    };

    var totcc=0; 
    for (i = 0; i < mCenterCounts.length; i++) { 
          totcc += mCenterCounts[i];
          document.getElementById('cc'+(i+1)).innerHTML=mCenterCounts[i];
          document.getElementById('elim'+(i+1)).innerHTML = mCenterCounts[i]==0 ? mElims[i] : "----";
    }
    document.getElementById('ccT').innerHTML=totcc;

    var decs=1;
    for (si = 0; si<displayscores.length; si++) { 
        var tots=0;
        for (i = 0; i < mCenterCounts.length; i++) { 

          var score=displayscores[si][i];
          //var score=1;

    	  tots += score;
    	  decs=maxdecs;
          score=Math.round(Math.pow(10,decs)*score)/Math.pow(10,decs);
    	  if(Math.round(score)==score){ decs=0;}
    	  var s=score.toFixed(decs) + suffix;
    	  document.getElementById('s'+si+(i+1)).innerHTML=s;
        }
        decs=maxdecs;
        tots=Math.round(Math.pow(10,decs)*tots)/Math.pow(10,decs);
        if(Math.round(tots)==tots){ decs=0;}
        document.getElementById('sT'+si).innerHTML=tots.toFixed(decs)+suffix;
    }
}

function getCenterCountTotal(){
    var i; var tot=0;
    for (i = 0; i < mCenterCounts.length; i++) { 
      tot += mCenterCounts[i];
    }
	return tot;
}

function ChangeCenterCount(pPowerID,pAmount){
	if (getCenterCountTotal()+pAmount>34) {
    	document.getElementById('ccT').style.color="red";
    	return;
    } else {
    	document.getElementById('ccT').style.color="black";
    }
    
	if (mCenterCounts[pPowerID-1] == 1 && pAmount == -1){
		mElims[pPowerID-1] = Math.max(...mElims);    
    }

	mCenterCounts[pPowerID-1] += pAmount;
    if (mCenterCounts[pPowerID-1]<0) mCenterCounts[pPowerID-1]=0;
    if (mCenterCounts[pPowerID-1]>34) mCenterCounts[pPowerID-1]=34;
    UpdateDisplay();
}

function ChangeElim(pPowerID,pAmount){    
	mElims[pPowerID-1] += pAmount;
    if (mElims[pPowerID-1]<1902) mElims[pPowerID-1]=1902;
    UpdateDisplay();
}

function ChangeVote(pPowerID){   
	var ckb = document.getElementById('ckbVote'+pPowerID);
	mVotedOut[pPowerID-1] = ckb.checked;
    UpdateDisplay();
}

function ChangeShowType(){
    mShowScoreType+=1;
    if(mShowScoreType>2)mShowScoreType=0;
    UpdateDisplay();
}

function SetBoard(pCenters){
    mCenterCounts=pCenters;
    UpdateDisplay();
}

function MakeSampleBoards(){
    var boards=[
        [15,14,4,1,0,0,0]
        ,[12,11,5,5,1,0,0]
        ,[11,10,7,3,2,1,0]
        ,[10,9,5,5,4,1,0]
        ,[8,7,6,6,3,3,1]
        ];
    var s="Samples: ";
    for (i = 0; i < boards.length; i++){
        var ccs=boards[i];
        s += '<button style="margin-right: 5px" onclick="SetBoard(['+ccs+'])">'+ccs+'</button>';
    }
    document.getElementById('sampleboards').innerHTML=s;
} 

function AddSystem(pLabel){
    mFixedSystems.forEach(x=>{
        if(x[0]==pLabel) mSystemLabelAverages.push(x);
    })
    makeSystemControls();
}

function RemoveSystem(pLabel){
    for (si = 0; si<mSystemLabelAverages.length; si++) { 
        var x=mSystemLabelAverages[si];
        if(x[0]==pLabel)  mSystemLabelAverages.splice(si,1);
    }   
    makeSystemControls();
}

function makeSystemControls(){
    var s='';
    
    //mSystemLabelAverages.forEach(x=>
    //    s += '<button onclick="RemoveSystem(\''+ x[0] + '\')">' + x[0] + '</button> '
    //);
    //if(s=='') s='(none)';
    //document.getElementById('divRemoveSystems').innerHTML='Remove: ' + s;
    //document.getElementById('divRemoveSystems').innerHTML='Click the header to remove.';
    document.getElementById('divRemoveSystems').style.display="none";

    var notselected=[];
    var selected=[];
    mSystemLabelAverages.forEach(x=>selected.push(x[0]));
    mFixedSystems.forEach(x=>{if(!selected.includes(x[0])) notselected.push(x[0]);});
    
    s='';
    mFixedSystems.forEach(x=>{
        if(notselected.includes(x[0])) s += '<button onclick="AddSystem(\''+ x[0] + '\')">' + x[0] + '</button> '
    });
    if(s=='') s='(none)';

    s='';
    mSystemGroups.forEach(group=>{
        var sg = '';
        group[1].forEach(x=>{
            if(notselected.includes(x[0])) sg += '<button onclick="AddSystem(\''+ x[0] + '\')">' + x[0] + '</button> ';
        });
            
        if(sg == '') sg = '(none)';
        sg = '<div class="bfSystemGroup">' + group[0] + ": " + sg +'<br></div>';
        s += sg;
    });

    document.getElementById('divAddSystems').innerHTML=s;

    makeScoreTable();
    UpdateDisplay();
}

function makeScoreTable(){

	var powernames=['Austria','England','France','Germany','Italy','Russia','Turkey'];
	
    var s ='';
    
    s += '<button class="bf ToggleShowType" id="btnToggleAverage" onclick="ChangeShowType()">xxx</button><span style="font-size: 12px;  float: right" id="spnLegend"></span>';
    
    s += '<table class = "score">';

	s += '<tr class = "row">';
    s += '  <td class="bfTribCalcRow bfTribCalcRow-s">';
    s += '    <span class="bfRowHeader"></span>';
    //s += '    <span class="bfCenterSpan">';
    s += '   	<span class="bfCenterSpan bfColHeader">Centers</span>';
    s += '   	<span class="bfCenterSpan bfColHeader">Elim in</span>';
    s += '   	<span class="bfCenterSpan bfColHeader">Self out</span>';
    s += '     </span>';
    s += '	</td>';

    s += '	<td class="bfTribCalcRow bfTribCalcRow-s">';
    
    mSystemLabelAverages.forEach((x,si)=>{
        s += '<span class="bfScore bfScoreHeader" id="s'+si+'0">';
        s += '<button class="bfRemoveSystem" onclick = "RemoveSystem(\''+ x[0] + '\')">';
        s += x[0] + '</button></span>';
    });
    s += '	</td>';
    s += '</tr>';

    powernames.forEach((powername,i)=>{
    	s += '<tr class = "row bf' + powername + '">';
        
        s += '<td class="bfTribCalcRow bfTribCalcRow-s">';
        s += '<span class="bfRowHeader">' + powername + '</span>';

        s += '<span class="bfCenterSpan">';
        s += '<button class="bf bf' + powername + '" onclick="ChangeCenterCount(' +(i+1)+ ',-1)">-</button>';
        s += '<span class="bfCenterCount" id="cc' +(i+1)+ '"></span>';
        s += '<button type="button" class="bf bf' + powername + '" onclick="ChangeCenterCount(' +(i+1)+ ',1)">+</button>';
        s += '</span>';

        s += '<span class="bfCenterSpan">';
        s += '<button class="bf bf' + powername + '" onclick="ChangeElim(' +(i+1)+ ',-1)">-</button>';
        s += '<span class="bfElim" id="elim' +(i+1)+ '"></span>';
        s += '<button type="button" class="bf bf' + powername + '" onclick="ChangeElim(' +(i+1)+ ',1)">+</button>';
        s += '</span>';
        
        s += '<span class="bfCenterSpan"><input type=checkbox id="ckbVote'+(i+1)+'" onclick="ChangeVote('+(i+1)+')">';
        s += '</span>';

        s += '</td>';
        s += '<td class="bfTribCalcRow bfTribCalcRow-s">';

        mSystemLabelAverages.forEach((x,si)=>{
    		s += '<span class="bfScore"  id="s'+si+(i+1)+'"></span>';
        });

        s += '</td>';
        s += '</tr>';

    });

    s += '<tr>';
    s += '  <td class="bfTribCalcRow bfTribCalcRow-s">';
    s += '    <span class="bfRowHeader">Total</span>';
    s += '    <span class="bfCenterSpan"><span id="ccT" class="bfCenterCount"></span></span>';
    s += '    <span class="bfCenterSpan"><span id="ccT" class="bfCenterCount"></span></span>';
    s += '    <span class="bfCenterSpan"></span>';
    s += '	</td>';

    s += '	<td class="bfTribCalcRow bfTribCalcRow-s">';
    mSystemLabelAverages.forEach((labelavg,si) => 
        s += '<span class="bfScore" id="sT'+si+'"></span>'
    );    
    s += '	</td>';
    s += '</tr>';

  	s += '</table>';
    
    document.getElementById('scoretable').innerHTML=s;
    
    SetScoreColumnWidths();
}

function SetScoreColumnWidths(){
    
    mSystemLabelAverages.forEach((labelavg,si) => {
        var header = document.getElementById('s'+si+'0');
        var width = header.getBoundingClientRect().width;
        width = Math.max(70,width);
        
        var spans = [header];
        
        [1,2,3,4,5,6,7].forEach(i=>{
            spans.push(document.getElementById('s'+si+i));
        });

        spans.push(document.getElementById('sT'+si));

        spans.forEach(x=>{
            //x.style.border = '1px solid';
            x.style.width = width+'px';
        });
        
    });    
    
}

function CreateCalculator(containerid){
    var container = document.getElementById(containerid);

    var div = document.createElement("div");
    div.id ="divAddSystems";
    div.className = "bfAddRemove bfAdd"
    container.addChildElement(div);

    div = document.createElement("div");
    div.id ="divRemoveSystems";
    div.className = "bfAddRemove bfRemove"
    container.addChildElement(div);

    div = document.createElement("div");
    div.id ="debug";
    container.addChildElement(div);

    div = document.createElement("div");
    div.id ="scoretable";
    div.style = "display: inline-block"
    container.addChildElement(div);

    div = document.createElement("div");
    div.id ="sampleboards";
    div.style = "margin: -40px 0px 10px 10px"
    container.addChildElement(div);

    SetUpSystems();

    //AddSystem('Carnage');
    //AddSystem('PPSC');
    //AddSystem('Dixie');
    //AddSystem('CDiplo');
    //AddSystem('SoS');
    //AddSystem('Tribute');
    makeSystemControls();
    
    MakeSampleBoards();
}


