type BlobStreamParams = {
    type: 'open' | 'download';
    fileName: string;
}

export class BlobStream {
    private _blobstream: any = null;
    private _blob: any = null;
    private _url: string;
    
    public get stream() : any {
        if (!this._blobstream) this._blobstream = new window['blobStream']();
        return this._blobstream;
    }
    
    async blob(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._blobstream.on('finish', () => {
                this._blob = this._blobstream.toBlob('application/pdf');
                this._url = window.URL.createObjectURL(this._blob);
                resolve(this._blobstream);
            });    
        })
    }

    async open() {
        if (this._url) window.open(this._url);
    }

    url() {
        return this._url;
    }

    async download(fileName: string) {
        if (this._url) {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.href = this._url;
            a.download = fileName;
            a.style.position = 'fixed';
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
        }
    }
}
