require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


//  导入图片数据并转化为url地址
let imgDatas = require('../data/imgDatas.json');
imgDatas = (function (imgDatasArr) {
  for(let i=0, len=imgDatasArr.length;i<len;i++){
    let item = imgDatasArr[i];
    item.imgURL = require('../images/' +item.fileName);
    imgDatasArr[i] = item;
  }
  return imgDatasArr;
})(imgDatas);

//  定义图片组件
class ImgComponent extends React.Component{
  render(){
    return (
      <figure className="item">
        <img
          src={ this.props.data.imgURL }
          alt={ this.props.data.title }
          className="item-img"
        />
        <figcaption className="item-title">
          <h2>{ this.props.data.title }</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  render() {
    let imgsComponent = [],
        imgControllerComponent = [];

    imgDatas.forEach(function (value, index) {
      imgsComponent.push(<ImgComponent data={ value } key={ index }/>);
    });

    return (
      <div className="container">
        <section className="img-area">
          { imgsComponent }
        </section>
        <nav className="img-controller">
          { imgControllerComponent }
        </nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
