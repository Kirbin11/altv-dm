import * as alt from 'alt-client';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUi.js';
import {AvailableDances, AvailableAnimations} from './includes/emotes.js';
let prop = null;
const menu = new NativeUI.Menu("Анимки", "", new NativeUI.Point(50, 50));
menu.GetTitle().Scale = 1.5;
menu.GetTitle().DropShadow = true;
menu.AddItem(new NativeUI.UIMenuItem("Stop", ""));




let menuDanceItem = new NativeUI.UIMenuItem("Танцы", "Какието Танцы.");
menu.AddItem(menuDanceItem);

const DanceMenu = new NativeUI.Menu("танец", "ТОНЕЦ:", new NativeUI.Point(50, 50));
DanceMenu.Visible = false;
DanceMenu.GetTitle().Scale = 0.9;

menu.AddSubMenu(DanceMenu, menuDanceItem);

AvailableDances.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "чет там танцы хз.");
	DanceMenu.AddItem(DanceItem);
});

let menuAniamtionItem = new NativeUI.UIMenuItem("анимацонен", "чет там анимациелоыфв.");
menu.AddItem(menuAniamtionItem);

const AnimationMenu = new NativeUI.Menu("анимкаф", "Animation:", new NativeUI.Point(50, 50));
AnimationMenu.Visible = false;
AnimationMenu.GetTitle().Scale = 0.9;

menu.AddSubMenu(AnimationMenu, menuAniamtionItem);

AvailableAnimations.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "алле оп анимация.");
	AnimationMenu.AddItem(DanceItem);
});


menu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && item.Text == "Stop") {
		game.clearPedTasks(alt.Player.local.scriptID);
		if (!prop || prop == null) return;
			alt.setTimeout(() => {
				game.detachEntity(prop, true, false);
				game.deleteObject(prop);
				prop = null;
			}, 800);
	}
    else {

    }
});

alt.onServer('playAnimPickup', ()=>{
	//let SelectedAnimation = AvailableAnimations[selectedItemIndex];
	playAnimation("random@street_race", "_car_a_flirt_girl", 1, 2000);
});

DanceMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableDances.length) {
		
		let SelectedDance = AvailableDances[selectedItemIndex];
		
		
		playAnimation(SelectedDance.dict, SelectedDance.anim, 1, 300000);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});

AnimationMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableAnimations.length) {
		
		let SelectedAnimation = AvailableAnimations[selectedItemIndex];

		playAnimation(SelectedAnimation.dict, SelectedAnimation.anim, 1, SelectedAnimation.EmoteDuration);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});






alt.on('keyup', (key) => {
    if (key === 0x58) {
        if (menu.Visible || DanceMenu.Visible || AnimationMenu.Visible)
		{
            menu.Close();
			DanceMenu.Close();
			AnimationMenu.Close();
        }
		else
		{
			menu.Open();
		}
    }
});










function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}
