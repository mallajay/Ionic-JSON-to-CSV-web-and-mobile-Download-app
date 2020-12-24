import { Component, OnInit } from "@angular/core";

import { Platform, LoadingController } from "@ionic/angular";

import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import * as XLSX from "xlsx";
import { HelperService } from '../services/helper-service/helper.service';
import { WidgetUtilService } from '../services/widgetUtil-service/widget-util.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  sampledata = [
    {
      a: "variable 1",
      b: "variable 2",
      c: "variable 3",
      e: "variable 4",
      f: "variable 5",
      g: "variable 6",
    },
    {
      a: "variable 7",
      b: "variable 8",
      c: "variable 9",
      e: "variable 10",
      f: "variable 11",
      g: "variable 12",
    },
  ];

  weeknumber: "Test";
  attachmentUrl: any;

  constructor(
    private widgetUtilService: WidgetUtilService,
    private platform: Platform,
    private helperService: HelperService,
    private file: File,
    private fileOpener: FileOpener,
    private loadingCtrl: LoadingController
  ) {}

  onDownload() {
    if (this.helperService.isNativePlatform()) {
      this.onDownloadMobile();
    } else {
      this.onDownloadWeb();
    }
  }

  onDownloadWeb() {
    try {
      const csvData = this.objectToCsv(this.sampledata);
      this.download(csvData);
      this.widgetUtilService.presentToast("Download Successfull");
    } catch (err) {
      this.widgetUtilService.presentToast(`ERROR: ${err}`);
    }
  }

  onDownloadMobile() {
    let dataArray = JSON.parse(JSON.stringify(this.sampledata));

    let sheet = XLSX.utils.json_to_sheet(dataArray);
    let wb = {
      SheetNames: ["export"],
      Sheets: {
        export: sheet,
      },
    };

    let wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    });

    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    const fileName = "WBI" + "-" + this.weeknumber + ".xlsx";
    let fileExtn = fileName.split(".").reverse()[0];
    let fileMIMEType = this.getMIMEtype(fileExtn);

    this.getStoragePath().then((url) => {
      //Writing File to Device
      this.file
        .writeFile(url, fileName, blob, { replace: true })
        .then((success) => {
          console.log("File created Succesfully" + JSON.stringify(success));

          this.attachmentUrl = success.nativeURL;
          this.fileOpener
            .open(success.nativeURL, fileMIMEType)
            .then((success) => {
              console.log("File Opened Succesfully" + JSON.stringify(success));
            })
            .catch((error) =>
              console.log("Cannot Open File " + JSON.stringify(error))
            );
        })
        .catch((error) =>
          console.log("Cannot Create File " + JSON.stringify(error))
        );
    });

    //open File

    // delete this.allItems;

    // this.allItems ="";

    // this.allItems.length = 0;

    // this.allItems.remove(); //[]

    dataArray = "";

    /* delete this.plantRadioResult;

    delete this.monthRadioResult;

    delete this.YearRadioResult; */
  }

  download(data) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "download.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  objectToCsv(data) {
    const CsvRows = [];
    //get header
    const headers = Object.keys(data[0]);
    CsvRows.push(headers.join(","));
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      CsvRows.push(values.join(","));
    }
    return CsvRows.join("\n");
  }

  getStoragePath() {
    let file = this.file;
    return this.file
      .resolveDirectoryUrl(this.file.externalRootDirectory)
      .then(function (directoryEntry) {
        return file
          .getDirectory(directoryEntry, "solarOne", {
            create: true,
            exclusive: false,
          })
          .then(function () {
            return directoryEntry.nativeURL + "solarOne/";
          });
      });
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      txt: "text/plain",
      docx:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      bmp: "image/bmp",
      png: "image/png",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      rtf: "application/rtf",
      ppt: "application/vnd.ms-powerpoint",
      pptx:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return MIMETypes[ext];
  }
}
