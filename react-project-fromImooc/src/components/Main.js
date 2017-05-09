require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


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

/*
 *  获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/*
 *  获取正负30度的旋转角度
 */
function get30DegRandom() {
  return (Math.random()>0.5 ? '' : '-') +Math.ceil(Math.random() * 30);
}

//  定义图片组件
class ImgComponent extends React.Component{
  //  点击旋转图片事件
  handleClick(e){
    // alert(1);
    if(this.props.arrange.isCenter){
      this.props.reverse();
    } else{
      this.props.center()
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    let styleObj = {};

    //  如果props指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //  如果图片旋转角度右且不为0，添加转转
    if(this.props.arrange.rotate){
      ['Webkit', 'Moz', 'ms', 'O', ''].forEach( (value) => {
        styleObj[value +'transform'] = 'rotate('+ this.props.arrange.rotate +'deg)';
      })
    }

    //  设置中心图片的z-index
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //  设置反转类名
    let imgItemClassName = 'item';
    imgItemClassName += this.props.arrange.isReverse ? ' is-reverse' : '';

    return (
      <figure className={ imgItemClassName } style={ styleObj } onClick={ this.handleClick.bind(this) }>
        <img
          src={ this.props.data.imgURL }
          alt={ this.props.data.title }
          className="item-img"
        />
        <figcaption className="item-title">
          <h2>{ this.props.data.title }</h2>
          <div className="item-back" onClick={ this.handleClick.bind(this) }>
            <p>{ this.props.data.description }</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgArrangeArr: [
        /*{
         *  pos: {               //  定位信息
         *    left: 0,
         *    top: 0
         *  },
         *  rotate: 0,           //  旋转信息
         *  isReverse: false,    //  正反信息
         *  isCenter: false      //  居中信息
         *}
         */
      ]
    }
  }

  //  定位信息
  Constant = {
    centerPos: {
      left: 0, top: 0
    },
    hPosRange: {  //  水平方向布局定位方位
      leftSecX: [0, 0],  //  左分区
      rightSecX: [0, 0],  //  右分区
      y: [0, 0]
    },
    vPosRange: {  //  垂直方向布局定位范围
      x: [0, 0],
      topY: [0, 0]
    }
  };

  /*
   *    翻转图片
   *    @param  index  输入需要被转的那个图片的index
   *    @return  {Function}  一个闭包，返回一个真正待被执行的函数
   */
  reverse(index){
    return (() => {
      let imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isReverse = ! imgArrangeArr[index].isReverse;
      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    });
  }

  /*
   *   重新布局所有图片
   *   @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex){
    let imgArrangeArr = this.state.imgArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),  //  取一个或者不取
      topImgSpliceIndex = 0,
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    //  首先居中centerIndex图片,旋转角度为0，居中。。。
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //  取出布局上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //  布局位于上侧的图片
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index] = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    //  布局左右两侧的图片
    for(let i=0, len=imgArrangeArr.length, k=len/2;i<len;i++){
      let hPosRangeLORX = i<k ? hPosRangeLeftSecX : hPosRangeRightSecX;
      imgArrangeArr[i] = {
        pos: {
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    //  重新填充上侧图片
    if(imgArrangeTopArr && imgArrangeTopArr[0]){
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }

    //  重新填充居中图片
    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

    //  重新渲染
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }

  /*
   *   利用rearrange来居中需要居中的图片
   *   @param  index  传入居中的index信息
   *   @return  {Function}  返回一个闭包，执行居中
   */
  center(index){
    return (() => {
      this.rearrange(index);
    });
  }

  //  组件加载完成，计算坐标
  componentDidMount(){
    //  拿到舞台大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //  拿到一个图片item的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.img0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //  计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //  计算左、右侧排布区域
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //  计算上、下侧排布区域
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    let imgsComponent = [],
        imgControllerComponent = [];

    imgDatas.forEach( (value, index) => {
      if(!this.state.imgArrangeArr[index]){
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0, top: 0
          },
          rotate: 0,
          isReverse: false,
          isCenter: false
        };
      }

      imgsComponent.push(
        <ImgComponent
          data={ value }
          key={ index }
          ref={ 'img' +index }
          arrange = { this.state.imgArrangeArr[index] }
          reverse = { this.reverse(index) }
          center = { this.center(index) }
        />
      );
    });

    return (
      <div className="container" ref="stage">
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
