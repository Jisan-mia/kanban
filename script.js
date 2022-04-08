const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// item lists
const listColumns = document.querySelectorAll('.dragndrop-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');


// items
let isUpdatedOnLoad = false;


// initialize array
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = []

// drag functionality
let draggedItem;
let currentColumn;


// localStorage 
// get arrays from localStorage if available, set defaults if not.
function getSavedColumns() {
  if(localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems)
    completeListArray = JSON.parse(localStorage.completeItems)
    onHoldListArray = JSON.parse(localStorage.onHoldItems)
  } else {
    backlogListArray = ['this is backlog', 'testing backlog'];
    progressListArray = ['this is progress', 'on the way'];
    completeListArray = ['this is complete', 'Yahh!, completed'];
    onHoldListArray = ['Hold me for some time'];
  }
}


// set localStorage arrays
function updateSavedColumns() {
  listArray = [ backlogListArray, progressListArray, completeListArray, onHoldListArray ];
  const listNames = ['backlog', 'progress', 'complete', 'onHold'];

  listNames.forEach((listName, index) => {
    localStorage.setItem(`${listName}Items`, JSON.stringify(listArray[index]));
  })

  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
}


// create dom elements for each list item
function createItemElm(columnEl, column, item, index) {
  // console.log({ columnEl, column, item, index });

  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;

  listEl.setAttribute('ondragstart', 'drag(event)')

  // append into the right column
  columnEl.appendChild(listEl)

}



// update column in dom - reset html, filter array, update, localStorage

function updateDOM() {
  // check localStorage once
  if(!isUpdatedOnLoad) {
    getSavedColumns();
  }


  // backlog column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemElm(backlogList, 0, backlogItem, index)
  })

  // progress column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index) => {
    createItemElm(progressList, 1, progressItem, index)
  })

  // complete column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemElm(completeList, 2, completeItem, index)
  })

  // on hold column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemElm(onHoldList, 3, onHoldItem, index)
  })


  // run getSavedColumns only once, update localStorage
  isUpdatedOnLoad = true
  updateSavedColumns();
}


// add item to column
function addItemToColumn(columnIndex) {
  const itemText = addItems[columnIndex].textContent;
  const selectedArray = listArray[columnIndex];
  selectedArray.push(itemText);
  addItems[columnIndex].textContent = '';

  updateDOM()
}

// show add item container
function showAddContainer(columnIndex) {
  addBtns[columnIndex].style.display = 'none'
  saveItemBtns[columnIndex].style.display = 'block';
  addItemContainers[columnIndex].style.display = 'block'
}

// save an item
function saveItem(columnIndex) {
  addBtns[columnIndex].style.display = 'block'
  saveItemBtns[columnIndex].style.display = 'none';
  addItemContainers[columnIndex].style.display = 'none'

  addItemToColumn(columnIndex)
}



// allow items to reflect drag n drop items
function rebuildArrays() {
  const eachListArrays = [backlogList, progressList, completeList, onHoldList];

  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for(let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  for(let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  for(let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  for(let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  

  updateDOM();

}

// when items start dragging 
function drag(e) {
  draggedItem = e.target;
  // console.log(draggedItem)
}

// allow items to drop on column
function allowDrop(e) {
  e.preventDefault();
}

// on drag enter(when items enter column area)
function dragEnter(columnIndex) {
  listColumns[columnIndex].classList.add('over');
  currentColumn = columnIndex
}

// dropping items into columns
function dropItem(e) {
  e.preventDefault();
  // remove bg color
  listColumns.forEach(column => {
    column.classList.remove('over');
  })

  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays()
}



// onload
updateDOM();