/**
 * Created by 石英 on 2018/12/4 0004上午 8:36.
 */


import React from 'react';
import {Layout, Radio, Alert, Button} from 'element-react';

import 'element-theme-default';


class AuthorizedPersonModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTips: false,
        }
    }

    takeNew = ({array, darenIds = []}) => {
        let authorized = [];
        array.forEach(item => {
            if (darenIds.indexOf(item.id) > -1) {
                authorized.push(item);
            }
        });
        return authorized;
    };

    authorizedPerson(value) {
        this.props.authorizedPersonChange(value);
    }

    render() {
        let {authorizedPersonList, talentMessageIds, authorizedPerson} = this.props, {isTips} = this.state;
        let array = this.takeNew({array: authorizedPersonList, darenIds: talentMessageIds});
        return (
            <Layout.Row gutter="20" style={{margin: "5px 0 15px"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    选择达人号
                </Layout.Col>
                <Layout.Col span="22">
                    <Button size="small" type="text" style={{marginRight:'10px'}} onClick={() => {
                        window.open(`https://www.yuque.com/li59rd/grkh9g/znzdeg`)
                    }}>为什么要选择达人账号？</Button>
                    <Radio.Group value={authorizedPerson} onChange={this.authorizedPerson.bind(this)}>
                        <Radio value=''>
                            不使用达人账号
                        </Radio>
                        {array.map(item => {
                            return (
                                <Radio key={`type${item.id}`} value={item.id} disabled={!item.cookieIsFailure}>
                                    {item.title}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </Layout.Col>
            </Layout.Row>
        );
    }
}

export default AuthorizedPersonModule;