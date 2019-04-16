import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Player, BigPlayButton, ControlBar, PlayToggle, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import 'video-react/dist/video-react.css';
import styles from './VideoEditor.less';

interface ProductProps extends React.Props<any> {
  product?: any;
  dispatch?: Function;
}

@connect((state) => ({
  product: state.product,
}))
export default class Product extends PureComponent<ProductProps> {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
    }
  }
  componentDidMount() {
    console.info('==this.refs==', this.refs);
    this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  handleStateChange(state, prevState) {
    // copy player state to this component's state
    console.info('==player state==', state);
    this.setState({
      player: state
    });
  }

  render() {
    const { product } = this.props;
    return (
      <div className={styles.container}>
        {/* <div className={styles.fixedHeader}>header</div> */}
        <div className={styles.content}>
          <div className={styles.menu}>Menu</div>
          <div className={styles.phone}>
            <div className={styles.videoView}>
              <div className={styles.videoWrapper}>
                {/* <video className={styles.video} webkit-playsinline="webkit-playsinline" playsinline="playsinline" poster="https://img.alicdn.com/imgextra/i2/6000000000189/O1CN01WDlVLy1DGbMnc9Gb4_!!6000000000189-0-tbvideo.jpg" draggable="true" data-spm-anchor-id="a211iz.11629543.0.i20.6039bxikbxikIz">
                  <source src="http://cloud.video.taobao.com/play/u/549657177/p/2/e/6/t/1/222173706368.mp4" />
                </video> */}
                <Player ref="player" className={styles.video} preload="auto" poster="https://img.alicdn.com/imgextra/i2/6000000000189/O1CN01WDlVLy1DGbMnc9Gb4_!!6000000000189-0-tbvideo.jpg">
                  <source src="http://cloud.video.taobao.com/play/u/549657177/p/2/e/6/t/1/222173706368.mp4" />
                  <BigPlayButton position="center" />
                  <ControlBar autoHide={false} disableDefaultControls={false}>
                    <PlayToggle />
                    <CurrentTimeDisplay />
                    <TimeDivider />
                    <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
                    <VolumeMenuButton vertical={true} disabled={true} />
                  </ControlBar>
                </Player>
              </div>
              <div className={styles.videoWrapperMask} />
            </div>
          </div>
          <div className={styles.main}>content</div>
        </div>
        <div className={styles.footer}>footer</div>
      </div>
    );
  }
}
