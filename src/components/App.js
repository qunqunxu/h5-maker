/**
 * Created by Soup Tang on 2016/1/22.
 */
import React from 'react';
import Immutable from 'immutable';
import Page from './Page';
import ElementBar from './ElementBar';
import PageList from './PageList';
import ControlBar from './ControlBar';
import Store from '../store/Store';
import * as ElementsAction from '../actions/ElementsAction';
import '../scss/App.scss';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pagesEntity: Immutable.Map(),
            elementsEntity: Immutable.Map(),
            control: Immutable.Map(),
            errorBarComponent: null,
            loadingComponent: null
        };
    }

    componentWillMount() {
        if (true) {
            //创建初始化
            Store.dispatch(ElementsAction.init());
            this.setState(Store.getState());
        }
        else {
            //更新初始化
        }
    }

    //初始化的时候设置对store的侦听
    componentDidMount() {
        window.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 46://删除
                    Store.dispatch(ElementsAction.doDelete());
                    break;
                default:
                    console.log(e.keyCode)
            }
        });
        Store.subscribe(this.onStateChange.bind(this));
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.elementsEntity !== nextState.elementsEntity) {
            return true;
        }
        else if (this.state.control !== nextState.control) {
            return true;
        }
        else if (this.state.pagesEntity !== nextState.pagesEntity) {
            return true;
        }
        else if (this.state.errorBarComponent !== nextState.errorBarComponent) {
            return true;
        }
        return false;
    }

    render() {
        let {control,pagesEntity,elementsEntity} = Store.getState();
        let pages = pagesEntity.get('pages');
        let currentPage = pages.get(pagesEntity.get('activeIndex'));
        let elements = elementsEntity.get('elements');
        let currentElement = elements.get(elementsEntity.get('activeIndex'));
        if (currentPage) {
            window.elements = currentPage.get('elementsEntity').get('elements');
        }
        if (currentElement) {
            window.fontColor = currentElement.get('controlProps').get('fontColor');
        }
        return (
            <div>
                <PageList pages={pages} activeIndex={pagesEntity.get('activeIndex')}/>
                <ControlBar type={currentElement?currentElement.get('elementType'):'PAGE'}
                            delay={control.get('delay')}
                            duration={control.get('duration')}
                            animation={control.get('animation')}
                            fontSize={control.get('fontSize')}
                            fontColor={control.get('fontColor')}
                            backgroundColor={control.get('backgroundColor')}
                            textAlign={control.get('textAlign')}
                            zIndex={elements.indexOf(currentElement)}
                            maxZIndex={elements.size}/>
                <div className="main">
                    <div className="stage">
                        <ElementBar/>
                        <Page elementsEntity={elementsEntity}
                              backgroundColor={currentPage.get('backgroundColor')}/>
                    </div>
                </div>
            </div>
        );
    }

    onStateChange() {
        this.setState(Store.getState())
    }

    setControlBar() {
        var control = Store.getState().control;
        return (
            <ControlBar open={control.open} animation={control.animation}
                        zIndex={control.zIndex}
                        maxZIndex={Store.getState().elements.size}
                        animationOptions={control.animationOptions}/>
        )
    }

    setElement() {
        return Store.getState().elements.map(function (element, index, thisArray) {
            var className = ClassName(element.get('controlBarProps').animation, element.get('isActive') ? 'active' : '');
            switch (element.get('elementType')) {
                case GlobalValues.Static.TYPE.IMAGE:
                    return (
                        <Element rid={element.get('rid')}
                                 key={element.get('rid')}
                                 className={className}
                                 width={element.get('width')}
                                 height={element.get('height')}
                                 left={element.get('left')}
                                 top={element.get('top')}
                                 zIndex={element.get('zIndex')}
                                 elementType={element.get('elementType')}
                                 controlBarProps={element.get('controlBarProps')}>
                            <image className="full" draggable="false" src={element.get('src')}/>
                        </Element>
                    );
                case GlobalValues.Static.TYPE.TEXT:
                    return (
                        <Element rid={element.get('rid')}
                                 key={element.get('rid')}
                                 className={className}
                                 width={element.get('width')}
                                 height={element.get('height')}
                                 left={element.get('left')}
                                 top={element.get('top')}
                                 zIndex={element.get('zIndex')}
                                 elementType={element.get('elementType')}
                                 controlBarProps={element.get('controlBarProps')}>
                            <Text rid={result.rid} width={element.get('width')} height={element.get('height')}
                                  value={element.get('value')}/>
                        </Element>
                    )
            }
            return undefined;
        });
    }
}

module.exports = App;