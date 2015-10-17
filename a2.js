var tableLength = 20;
var tableHeight = 20;


//classic default game values
var neighborRadius = 1;
var lonelinessThreshold = 2;
var overpopulation = 3;
var gmin = 3;
var gmax = 3;

var continueStepping = false;

var cellIsAlive = Create2DArray(tableHeight, tableLength);


$(document).ready(function(){

  //intialize state and cells
  resizeTable(tableLength, tableHeight);

  $("#resizeTableButton").click( function() {
    resizeTable($("#tableLengthForm").val(), $("#tableHeightForm").val());
  });

  $("#setGameRulesButton").click(function() {
    setNeighborRadius($("#radiusForm").val() || neighborRadius);
    setLoneliness($("#lonelinessForm").val() || lonelinessThreshold);
    setOverpopulation($("#overpopulationForm").val() || overpopulation);
    setGmin($("#gminForm").val() || gmin);
    setGmax($("#gmaxForm").val() || gmax);
  })
});

var isStepping = false;
var continuousStepping;
var steppingInterval = 200;

var stepContinuous = function() {
  isStepping = !isStepping;
  if(!isStepping){
    clearInterval(continuousStepping);
  } else{
    continuousStepping = setInterval(stepOnce, steppingInterval);
  }
}

var stepOnceOnly = function() {
  if(!isStepping){
    stepOnce();
  }
}

var stepOnce = function() {
  var changeStack = [];

  for(var j = 0; j<tableHeight; j++){
    for(var i=0; i<tableLength; i++){
      currentCellStatus = cellIsAlive[j][i];
      if(handleCellStep(j, i, countAliveNeighbors(j, i))){

      changeStack.push({
          x: i,
          y: j,
          status: !currentCellStatus
        })
      }
    }
  }
  applyCellChanges(changeStack);
}

var handleCellStep = function(j, i, neighborCount){
  var changeflag = false;
  var cellAlive = cellIsAlive[j][i];

  if(neighborCount < lonelinessThreshold && cellAlive){
    changeflag = true;
  }else if(neighborCount > overpopulation && cellAlive){
    changeflag = true;
  }else if(neighborCount >= gmin && neighborCount <= gmax && !cellAlive){
    changeflag = true;
  }
  if(cellAlive && (neighborCount == 3 || neighborCount == 2)){
    changeflag = false;
  }

  return changeflag;

}

var applyCellChanges = function(changeStack){
  if(changeStack.length == 0){
    return
  }

  while(changeStack.length > 0){
    var currentCell = changeStack.pop();

    var changeStatus = currentCell.status;
    var currentX = currentCell.x;
    var currentY = currentCell.y;

    var cellId = "#"+currentY+"-"+currentX;



    if(!changeStatus){
      $(cellId).attr("class", "visiteddeadcell");
    }else {
      $(cellId).attr("class", "livecell");
    }
    cellIsAlive[currentY][currentX] = changeStatus;

  }
}

var countAliveNeighbors = function(j, i) {
  var thisPosY = j;
  var thisPosX = i;

  var MIN_X = 0;
  var MIN_Y = 0;
  var MAX_X = tableLength-1;
  var MAX_Y = tableHeight-1;

  var startPosX = (thisPosX - 1 < MIN_X) ? thisPosX : thisPosX-1;
  var startPosY = (thisPosY - 1 < MIN_Y) ? thisPosY : thisPosY-1;
  var endPosX =   (thisPosX + 1 > MAX_X) ? thisPosX : thisPosX+1;
  var endPosY =   (thisPosY + 1 > MAX_Y) ? thisPosY : thisPosY+1;

  var aliveCount = 0;
for (var colNum=startPosY; colNum<=endPosY; colNum++) {
  for (var rowNum=startPosX; rowNum<=endPosX; rowNum++) {
        // All the neighbors will be grid[rowNum][colNum]
        if(cellIsAlive[colNum][rowNum]){
          if(rowNum != thisPosX || colNum != thisPosY){
            aliveCount++;
          }
        }
    }
}

  return aliveCount;

}



function Create2DArray(rows, columns) {
  var arr = [];

  for (var j=0;j<rows;j++) {
    arr[j] = [];
     for(var i=0; i<columns; i++){
       arr[j][i] = false;
     }
  }

  return arr;
}

function getColumnNum(cell){
  return parseInt(cell.id.split('-')[0]);
}

function getRowNum(cell){
  return parseInt(cell.id.split('-')[1]);
}

function setNeighborRadius(inputRadius) {
  if(inputRadius >= 1 && inputRadius <= 10){
    neighborRadius = inputRadius;
  } else {
    alert("Radius must be within 1 and 10");
  }
}

function setLoneliness(inputLoneliness){
  if(inputLoneliness > 0 && inputLoneliness <= overpopulation){
    lonelinessThreshold = inputLoneliness;
  } else {
    alert("Invalid loneliness threshold");
  }
}

function setOverpopulation(inputOverpopulation) {
  var magicNumber = 4*neighborRadius*neighborRadius + 4*neighborRadius;
  if(inputOverpopulation >= lonelinessThreshold && inputOverpopulation < magicNumber ){
    overpopulation = inputOverpopulation;
  } else {
    alert("Invalid overpopulation threshold");
  }
}

function setGmin(inputGmin){

  if(inputGmin > 0 && inputGmin <= gmax){
    gmin = inputGmin;
  } else {
    alert("Invalid gmin");
  }
}

function setGmax(inputGmax){
  var magicNumber = 4*neighborRadius*neighborRadius + 4*neighborRadius;
  if(inputGmax >= gmin && inputGmax < magicNumber) {
    gmax = inputGmax;
  } else {
    alert("Invalid gmax");
  }
}

function resetGame(){
  neighborRadius = 1;
  lonelinessThreshold = 2;
  overpopulation = 3;
  gmin = 3;
  gmax = 3;
}

function clearTable(){
  for(var j=0; j<tableHeight; j++){
    for(var i=0; i<tableLength; i++){
      var id = j+'-'+i;
      $("#"+id).attr("class", "deadcell");
    }
  }
}

function fillRandom(){
  for(var j=0; j<tableHeight; j++){
    for(var i=0; i<tableLength; i++){
      var randNum = Math.random();
      var id = j+'-'+i;
      if(randNum <= 0.15){
        $("#"+id).attr("class", "livecell");
        cellIsAlive[j][i] = true;
      }else{
        $("#"+id).attr("class", "deadcell");
        cellIsAlive[j][i] = false;
      }
    }
  }
}

function resizeTable(row, column){
  $(".celltable").empty();
  tableHeight = column;
  tableLength = row;

  for(var j=0; j<tableHeight; j++){
    $(".celltable").append("<tr id="+"row"+j+"></tr>");

    for(var i=0; i<tableLength; i++){
      var id = j+'-'+i;

      $("#row"+j).append("<td class='deadcell' id="+id+"></td>");

      $("#"+id).click(function(){
        if(!isStepping){
          var i = getRowNum(this);
          var j = getColumnNum(this);

          if( $(this).hasClass("deadcell") || $(this).hasClass("visiteddeadcell")){
            $(this).attr("class", "livecell");
            cellIsAlive[j][i] = true;
          } else {
            $(this).attr("class", "visiteddeadcell");
            cellIsAlive[j][i] = false;
          }
        }
      });
    }

  };
}

function updateStepInterval(range){

  steppingInterval = range.value;

}
