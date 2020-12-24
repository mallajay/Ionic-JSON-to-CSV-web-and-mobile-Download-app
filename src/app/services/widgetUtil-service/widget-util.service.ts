import { Injectable } from "@angular/core";
import {
  PopoverController,
  ToastController,
  Platform,
  LoadingController,
  AlertController,
} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class WidgetUtilService {
  loaderToShow: any;

  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {}

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      // showCloseButton: true,
      position: this.platform.is("desktop") ? "top" : "bottom",
    });
    toast.present();
  }

  showAutoHideLoader(Tmessage, addDuration) {
    this.loadingController
      .create({
        message: Tmessage,
        duration: addDuration,
        animated: true,
        spinner: "lines",
        cssClass: "autoHideLoader",
      })
      .then((res) => {
        res.present();
        res.onDidDismiss();
      });
  }

  showLoader() {
    this.loaderToShow = this.loadingController
      .create({
        message: "This Loader will Not AutoHide",
      })
      .then((res) => {
        res.present();

        res.onDidDismiss().then((dis) => {
          console.log("Loading dismissed!");
        });
      });
    this.hideLoader();
  }

  // async presentLoading(loaderMessage) {
  //   const loading = await this.loadingController.create({
  //     message: loaderMessage,
  //   });
  //   return loading.present();
  // }

  async presentLoading(loaderMessage) {
    const loading = await this.loadingController.create({
      message: loaderMessage,
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  async dismissLoader() {
    await this.loadingController.dismiss();
  }

  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 4000);
  }

  async presentAlertConfirm(header, message, buttons) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons,
    });
    await alert.present();
  }

  async presentPopover(ev: any, component) {
    const popover = await this.popoverController.create({
      component: component,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }
}
