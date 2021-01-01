const searchForm = document.querySelector('div.wrapper form');
const searchHistoryDiv = document.querySelector('div.searchHistory');
const searchBoxDiv = document.querySelector('div.searchbox');
const searchBoxInput = searchBoxDiv.querySelector('input');
const clearHistoryButton = document.querySelector('p.clear button');

// function to create an element
function createElement(elementName, property = null, value = null) {
    let element = document.createElement(elementName);
    if (property && value) {
        element[property] = value;
    }
    return element;
}

// Checks if user's browser supports localStorage
function supportsLocalStorage() {
    return 'localStorage' in window && window['localStorage'] !== null;
}

// function to get the list of "recent searched text" from localStorage
function getRecentSearchesList() {
    if (localStorage.getItem('recentSearches')) {
        let recentSearches = localStorage.getItem('recentSearches');
        return JSON.parse(recentSearches).list;
    }
    return [];
}

// function to create or load existing local storage variable for 'recent searched text'
function createOrLoadRecentSearches() {
    recentSearchString = localStorage.getItem('recentSearches');
    if (!recentSearchString) {
        localStorage.setItem('recentSearches', '{"list": []}');
    } else {
        const resultsDiv = document.querySelector('div.results')
        const listOfAllSearches = getRecentSearchesList();
        if (listOfAllSearches) {
            for (let i = 0; i < listOfAllSearches.length; i++) {
                if (i == 20) {
                    break;
                }
                let p = createElement('p', 'textContent', listOfAllSearches[i]);
                resultsDiv.appendChild(p);
            }
        }
    }
}

// function to update/add search input's value to localStorage;
function addSearchTextToLocalStorage(text) {
    let recentSearches = getRecentSearchesList();
    recentSearches.unshift(text);
    let tempJSON = { list: recentSearches };
    let stringJSON = JSON.stringify(tempJSON);
    localStorage.setItem('recentSearches', stringJSON);
}

//function to update/add search input's value to the DOM;
function addSearchTextToDOM(searchText) {
    let resultDiv = document.querySelector('div.results');
    let p = createElement('p', 'textContent', searchText);
    if (resultDiv) {
        if (resultDiv.children) {
            let firstElement = resultDiv.firstElementChild;
            resultDiv.insertBefore(p, firstElement);
        } else {
            resultDiv.appendChild(p);
        }
    }
}
// When page fully loads it starts working on Recent Searches;
window.onload = () => {
    if (supportsLocalStorage()) {
        createOrLoadRecentSearches();
        // When someone submits a search it will add it to the DOM directly and Local Storage.
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let searchText = searchBoxInput.value;
            if (searchText) {
                addSearchTextToLocalStorage(searchText);
                addSearchTextToDOM(searchText);
            }
            searchBoxInput.value = '';
        })
    }
};

// Event Listener for 'clear history' button to clear searching history from the DOM and Local Storage.
clearHistoryButton.addEventListener('click', (e) => {
    const resultsDiv = searchHistoryDiv.querySelector('div.results');
    if (resultsDiv.children) {
        searchHistoryDiv.removeChild(resultsDiv);
        let div = createElement('div', 'className', 'results');
        searchHistoryDiv.appendChild(div);

        if ('recentSearches' in localStorage) {
            localStorage.setItem('recentSearches', '{"list": []}');
        }
    }
})