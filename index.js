// const model = new rw.HostedModel({
//   url: "https://housegenerator.hosted-models.runwayml.cloud/v1/",
//   token: "",
// });

let VECTORS = [];

// a function for finding min and max vector vals
function t() {
  let max = -Infinity;
  let min = Infinity;
  for (let i = 0; i < VECTORS.length; i++) {
    for (let j = 0; j < VECTORS[i].length; j++) {
      if (VECTORS[i][j] > max) {
        max = VECTORS[i][j];
      }
      if (VECTORS[i][j] < min) {
        min = VECTORS[i][j];
      }
    }
  }
  console.log("max: ", max, "min: ", min);
}

fetch("vectors.json")
  .then(response => response.json())
  .then(json => {
    VECTORS = json; 
    console.log("ready!"); 
    document.getElementById('startButton').style.display = 'block';
  });

// max:  0.234623521566391 min:  -0.1933659017086029

function clearCont() {
  const allContainers = document.getElementsByClassName('cont');
  for (i = 0; i < allContainers.length; i++) {
    allContainers[i].style.display = 'none';
  }
}

let pairArr = [];

// Here's a JavaScript implementation of the Durstenfeld shuffle, an optimized version of Fisher-Yates:
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function init_pairs() {
  for (let i = 0; i < 30; i++) {
    pairArr.push(i);
  }
  shuffleArray(pairArr);
  // console.log(pairArr);
}

let lastIndex = 3;

function populateSliders() {
  if (lastIndex > 17) {
    return;
  }
  const c = document.getElementById('slidecontainer');
  for (let i = lastIndex - 3; i < lastIndex; i++) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('slidecontainer');

    let im1 = document.createElement('img');
    im1.src = `./samples/download${pairArr[2 * i]}.jpg`;
    im1.classList.add('thumbnail');

    let slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1000;
    slider.value = 500;
    slider.classList.add('slider');
    slider.dataset.include = 1;

    let im2 = document.createElement('img');
    im2.src = `./samples/download${pairArr[2 * i + 1]}.jpg`;
    im2.classList.add('thumbnail');

    let x = document.createElement('p');
    x.innerText = '\u2715';
    x.classList.add('x_icon');
    x.onclick = () => {
      if (slider.dataset.include == 1) {
        wrapper.style.opacity = 0.3;
        slider.disabled = true;
        slider.dataset.include = 0;
      } else {
        wrapper.style.opacity = 1;
        slider.disabled = false;
        slider.dataset.include = 1;
      }
    }
    

    wrapper.appendChild(im1);
    wrapper.appendChild(slider);
    wrapper.appendChild(im2);
    wrapper.appendChild(x);
    c.appendChild(wrapper);
  }
  lastIndex += 3;
}

function moreOptions() {
  populateSliders();

  const els = document.getElementsByClassName('lessOptionsButton');
  for (let i = 0; i < els.length; i++) {
    els[i].style.display = 'block';
  }
  document.getElementById('moreOptionsButton').style.marginTop = "0px";

  if (lastIndex >= 17) {
    // const button = document.getElementById('moreOptionsButton');
    // button.disabled = true;
    // button.classList.add('disabled');
    // document.getElementById('moreOptionsButton').style.display = 'none';

    const els = document.getElementsByClassName('moreOptions');
    for (let i = 0; i < els.length; i++) {
      els[i].style.display = 'none';
    }
  }
}

function lessOptions() {
  lastIndex -= 3;
  const sliders = document.getElementsByClassName('slidecontainer');

  const num = sliders.length;
  for (let i = num - 1; i >= num - 3; i--) {
    sliders[i].remove();
  }
  if (lastIndex <= 6) {
    const els = document.getElementsByClassName('lessOptionsButton');
    for (let i = 0; i < els.length; i++) {
      els[i].style.display = 'none';
    }
    document.getElementById('moreOptionsButton').style.marginTop = "50px";
  }
  if (document.getElementById('moreOptionsButton').style.display == 'none') {
    const els = document.getElementsByClassName('moreOptions');
    for (let i = 0; i < els.length; i++) {
      els[i].style.display = 'block';
    }
  }
}

function clearSliders() {
  lastIndex = 3;
  const els = document.getElementsByClassName('slidecontainer');
  const l = els.length;
  for (let i = l - 1; i >= 0; i--) {
    els[i].remove();
  }
  const es = document.getElementsByClassName('lessOptionsButton');
    for (let i = 0; i < es.length; i++) {
      es[i].style.display = 'none';
    }
    document.getElementById('moreOptionsButton').style.marginTop = "50px";
}

let model = null;

function toWall() {
  clearCont();
  document.getElementById('entryway').style.display = 'flex';
}

function enter() {
  const v = document.getElementById('door').value;
  // model = new rw.HostedModel(p);

  fetch("https://housegenerator.hosted-models.runwayml.cloud/v1/", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${v}`,
      "Content-Type": "application/json",
    }
  })
  .then(response => response.json())
  .then(metadata => {
    const { status, queryRoute, dataRoute, errorRoute } = metadata;
    if (metadata.error) {
      alert('Wrong password: try again');
    } else {
      model = new rw.HostedModel({
        url: "https://housegenerator.hosted-models.runwayml.cloud/v1/",
        token: v,
      });
      makeSelection(true);
    }
  });
}

let storedInput = [];

function reshuffle() {
  // initialize the random pairs
  if (!pairArr.length) {
    init_pairs();
  } else {
    shuffleArray(pairArr);
  }
  // clear existing sliders
  clearSliders();
  // create the initial sliders
  populateSliders();
}


function makeSelection(startOver) { 
  if (startOver) {
    reshuffle();
  }
  clearCont();
  
  // when ready, display container
  document.getElementsByClassName('selection_container')[0].style.display = 'flex';
}

function boolCheck(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) return false;
  }
  return true;
}

let global4Versions = [];

function makeBuilding(input, firstTime) {
  storedInput = input;
  // console.log(input);
  clearCont();
  // document.getElementsByClassName('selection_container')[0].style.display = 'none';
  // document.getElementsByClassName('modify_container')[0].style.display = 'none';
  document.getElementsByClassName('loading_container')[0].style.display = 'flex';
  // document.getElementById('vecari_container').style.display = 'none';
  document.getElementById('modificationButtons').style.display = 'block';
  document.getElementById('scrollText').style.display = 'none';

  if (!model.isAwake()) {
    document.getElementById("asleep_message").style.display = "block";
    console.log("shhh I'm sleeping");
  } else {
    document.getElementById("asleep_message").style.display = "none";
    console.log("I'm awake and ready to go!");
  }

  if (!firstTime) {
    // document.getElementById('row1').style.display = 'none';
    // document.getElementById('row2').style.display = 'none';
    // document.getElementById('display').style.display = 'block';

    model.query(input).then(outputs => {
      const { image } = outputs;
      
      let imgs = document.getElementsByClassName('image');
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].src = image;
        }
      document.getElementsByClassName('loading_container')[0].style.display = 'none';
      document.getElementsByClassName('output_container')[0].style.display = 'flex';
    });
  } else {
    // modulate the output to produce 4 different versions
    const versions = [];

    versions.push(input.z);
    for (let i = 1; i < 4; i++) {
      const n = [];
      for (let j = 0; j < 512; j++) {
        if (Math.random() < 0.5) {
          n[j] = input.z[j] + -1 + 2 * Math.random();
        } else {
          n[j] = input.z[j];
        }
      }
      versions.push(n);
    }

    global4Versions = versions;

    let img_bools = [false, false, false, false];
    const imgs = document.getElementsByClassName('4versions');

    for (let i = 0; i < 4; i++) {
      model.query({ 'z': versions[i], 'truncation': input.truncation }).then(outputs => {
        const { image } = outputs;
        imgs[i].src = image;      
        img_bools[i] = true;
        if (boolCheck(img_bools)) {
          document.getElementsByClassName('loading_container')[0].style.display = 'none';
          document.getElementsByClassName('intermediate_container')[0].style.display = 'flex';   
        }
      });
    }
  }
}

function selectStarterImage(index) {
  const all = document.getElementsByClassName('4versions');
  storedInput = {'z': global4Versions[index], 'truncation': storedInput.truncation};
  let imgs = document.getElementsByClassName('image');
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].src = all[index].src;
  }
  // indicate that the selection has been made
  for (let i = 0; i < 4; i++) {
    if (i != index) all[i].style.opacity = 0.3;
    else all[i].style.opacity = 1;
  }
  // reveal button, hide text
  document.getElementById('inter_text').style.display = 'none';
  document.getElementById('proceed_button').style.display = 'inline-block';
  document.getElementById('inter_text2').style.display = 'block';
}

function proceedToOutput() {
  document.getElementsByClassName('output_container')[0].style.display = 'flex';
  document.getElementsByClassName('intermediate_container')[0].style.display = 'none';
}

let iter_index = 0;

function genAll() {
  console.log(iter_index);
  if (iter_index >= 30) {
    console.log("that'a all!");
    return;
  }
  let input = {"z": VECTORS[iter_index], "truncation": 0.7};
  iter_index++;
  makeBuilding(input, false);
}

function interpolate(val, i, j) {
  const v1 = VECTORS[i];
  const v2 = VECTORS[j];
  let res = [];
  for (let i = 0; i < 512; i++) {
    res.push(v1[i] + (v2[i] - v1[i]) * val);
  }
  return res;
}

function makeRandom() {
  let z = [];
  for (let i = 0; i < 512; i++) {
    z.push(-1 + 2 * Math.random());
  }
  let truncation = 0.6 + 0.4 * Math.random();
  let input = {"z": z, "truncation": truncation};
  makeBuilding(input, true);
}

function regenerate() {
  let prev = storedInput;
  // console.log(prev);
  prev.truncation = document.getElementById('truncation_slider').value / 1000;
  // console.log(prev);
  makeBuilding(prev, false);
}

function generate() {
  const sliders = document.getElementsByClassName('slider');

  const num = sliders.length;
  console.log("there are ", num, " sliders registered");

  let temp = [];

  for (let i = 0; i < num; i++) {
    // max 15 sliders, maybe less
    // there are max 30 vectors, maybe less
    const val = sliders[i].value;
    if (sliders[i].dataset.include == 1) {
      temp.push(interpolate(val / 1000, pairArr[i * 2], pairArr[i * 2 + 1]));
    }
  }

  let outVec = [];
  for (let i = 0; i < 512; i++) {
    let val = 0;
    for (let j = 0; j < temp.length; j++) {
      val += temp[j][i];
    }
    outVec.push(val);
  }

  const input = {"z": outVec, "truncation": 0.7};
  makeBuilding(input, true);
}

let first = true;

function displayModifyMenu() {
  document.getElementsByClassName('output_container')[0].style.display = 'none';
  document.getElementsByClassName('modify_container')[0].style.display = 'flex';
}

function updateTruncation(val) {
  document.getElementById('truncation_val').value = val / 1000;
}

function moreModifications() {
  document.getElementById('vecari_container').style.display = 'flex';
  document.getElementById('modificationButtons').style.display = 'none';
  document.getElementById('scrollText').style.display = 'block';
  
  if (first) {
    shuffleArray(pairArr);
    first = false;

    const columns = document.getElementsByClassName('column');

    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < 6; j++) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const img = document.createElement('img');
        img.classList.add('vec_ari_img');
        // make src the corresponding image house + pairArr[i * 6 + j]
        img.src = `./samples/download${pairArr[i * 6 + j]}.jpg`;
        img.dataset.weight = 0;
        img.setAttribute('role', 'button');
        img.id = pairArr[i * 6 + j];
        img.onclick = () => up_down_vote(pairArr[i * 6 + j]);
        img.style.pointerEvents = "all";
        img.style.cursor = 'pointer';
        wrapper.appendChild(img);

        const overlay = document.createElement('div');
        overlay.classList.add('overlays');
        overlay.id = `overlay${pairArr[i * 6 + j]}`;
        overlay.onclick = () => up_down_vote(pairArr[i * 6 + j]);
        wrapper.appendChild(overlay);

        columns[i].appendChild(wrapper);
      }
    }
  } else {
    const overlays = document.getElementsByClassName('overlays');
    const imgs = document.getElementsByClassName('vec_ari_img');
    for (let i = 0; i < overlays.length; i++) {
      if (overlays[i].classList.length > 1) {
        overlays[i].className = 'overlays';
      }
      imgs[i].dataset.weight = 0;
    }
  }
}

function elementwiseVectorAdd(vec1, vec2, factor) {
  return vec1.map((el, i) => el + factor * vec2[i]);
}

function regenerate2() {
  let new_input = storedInput;
  // console.log(prev);
  const feature_vectors_weights = document.getElementsByClassName('vec_ari_img');
  for (let i = 0; i < pairArr.length; i++) {
    new_input.z = elementwiseVectorAdd(new_input.z, VECTORS[pairArr[i]], feature_vectors_weights[i].dataset.weight);
  }

  new_input.truncation = document.getElementById('truncation_slider').value / 1000;
  // console.log(prev);
  makeBuilding(new_input, false);
}

function up_down_vote(id) {  
  const img = document.getElementById(id);
  const overlay = document.getElementById(`overlay${id}`);;
  // console.log(img.dataset.weight);
  if (img.dataset.weight == 0) {
    img.dataset.weight = 1;
    overlay.classList.add('green_overlay');
  } else if (img.dataset.weight  == 1) { 
    img.dataset.weight = -1; 
    overlay.classList.remove('green_overlay');
    overlay.classList.add('red_overlay'); 
  } else if (img.dataset.weight  == -1) { 
    img.dataset.weight = 0; 
    overlay.classList.remove('red_overlay');
  }
}

function toIntro() {
  clearCont();
  document.getElementById('intro_container').style.display = 'flex';
}

function storyTime() {
  clearCont();
  document.getElementById('story_container').style.display = 'flex';
}

function generateExact() {
  try {
    const input = JSON.parse(document.getElementById('custom_z').value);  
    if (input && (input.z != undefined) && (input.truncation != undefined) && input.z.length == 512 && input.truncation.length === 1) {
      makeBuilding(input, true);
    } else {
      alert('input is incorrectly formatted');
    }
  } catch(e) {
    alert(e);
  } 
}


// TODO:

// -- Output screen
// restart button --> will need to clear a lot of arrays I think --> wrote makeSelection(true)
// save button, save the parameters
// enlarge image on click & on hover in modification & inital selection modes
// share to social media button
// interact with the latent space:
  // different output UI - browse a 2D plane of images
  // interpolation animation - output a video

// -- Story screen
// more guided description of the science behind this --> in a story telling way
  // scrolling, visuals
// pre-generated sample collection --> submission option (through email?)

// -- Final touches
// animations! fades, slides
// general pretty things
// mobile version or mobile-proofing
