(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5573"],{23:function(e,t){},26:function(e,t){},27:function(e,t){},JSTL:function(e,t,a){"use strict";a.r(t);var n=a("4d7F"),r=a.n(n),l=a("EUZL"),o=a.n(l),i={props:{beforeUpload:Function,onSuccess:Function},data:function(){return{loading:!1,excelData:{header:null,results:null}}},methods:{generateData:function(e){var t=e.header,a=e.results;this.excelData.header=t,this.excelData.results=a,this.onSuccess&&this.onSuccess(this.excelData)},handleDrop:function(e){if(e.stopPropagation(),e.preventDefault(),!this.loading){var t=e.dataTransfer.files;if(1===t.length){var a=t[0];if(!this.isExcel(a))return this.$message.error("Only supports upload .xlsx, .xls, .csv suffix files"),!1;this.upload(a),e.stopPropagation(),e.preventDefault()}else this.$message.error("Only support uploading one file!")}},handleDragover:function(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy"},handleUpload:function(){document.getElementById("excel-upload-input").click()},handleClick:function(e){var t=e.target.files[0];t&&this.upload(t)},upload:function(e){(this.$refs["excel-upload-input"].value=null,this.beforeUpload)?this.beforeUpload(e)&&this.readerData(e):this.readerData(e)},readerData:function(e){var t=this;return this.loading=!0,new r.a(function(a,n){var r=new FileReader;r.onload=function(e){var n=e.target.result,r=t.fixData(n),l=o.a.read(btoa(r),{type:"base64"}),i=l.SheetNames[0],s=l.Sheets[i],u=t.getHeaderRow(s),c=o.a.utils.sheet_to_json(s);t.generateData({header:u,results:c}),t.loading=!1,a()},r.readAsArrayBuffer(e)})},fixData:function(e){for(var t="",a=0,n=10240;a<e.byteLength/n;++a)t+=String.fromCharCode.apply(null,new Uint8Array(e.slice(a*n,a*n+n)));return t+=String.fromCharCode.apply(null,new Uint8Array(e.slice(a*n)))},getHeaderRow:function(e){var t=[],a=o.a.utils.decode_range(e["!ref"]),n=void 0,r=a.s.r;for(n=a.s.c;n<=a.e.c;++n){var l=e[o.a.utils.encode_cell({c:n,r:r})],i="UNKNOWN "+n;l&&l.t&&(i=o.a.utils.format_cell(l)),t.push(i)}return t},isExcel:function(e){return/\.(xlsx|xls|csv)$/.test(e.name)}}},s=(a("yCqi"),a("KHd+")),u=Object(s.a)(i,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("input",{ref:"excel-upload-input",attrs:{id:"excel-upload-input",type:"file",accept:".xlsx, .xls"},on:{change:e.handleClick}}),e._v(" "),a("div",{attrs:{id:"drop"},on:{drop:e.handleDrop,dragover:e.handleDragover,dragenter:e.handleDragover}},[e._v("\n    Drop excel file here or\n    "),a("el-button",{staticStyle:{"margin-left":"16px"},attrs:{loading:e.loading,size:"mini",type:"primary"},on:{click:e.handleUpload}},[e._v("Browse")])],1)])},[],!1,null,"0c70e570",null);u.options.__file="index.vue";var c={name:"UploadExcel",components:{UploadExcelComponent:u.exports},data:function(){return{tableData:[],tableHeader:[]}},methods:{beforeUpload:function(e){return e.size/1024/1024<1||(this.$message({message:"Please do not upload files larger than 1m in size.",type:"warning"}),!1)},handleSuccess:function(e){var t=e.results,a=e.header;this.tableData=t,this.tableHeader=a}}},d=Object(s.a)(c,function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"app-container"},[t("upload-excel-component",{attrs:{"on-success":this.handleSuccess,"before-upload":this.beforeUpload}}),this._v(" "),t("el-table",{staticStyle:{width:"100%","margin-top":"20px"},attrs:{data:this.tableData,border:"","highlight-current-row":""}},this._l(this.tableHeader,function(e){return t("el-table-column",{key:e,attrs:{prop:e,label:e}})}))],1)},[],!1,null,null,null);d.options.__file="uploadExcel.vue";t.default=d.exports},"Uk5/":function(e,t,a){},yCqi:function(e,t,a){"use strict";var n=a("Uk5/");a.n(n).a}}]);