// @flow

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { Icon, IconInviteMore } from '../../../base/icons';
import {
    getLocalParticipant,
    getParticipantCountWithFake,
    getRemoteParticipants
} from '../../../base/participants';
import { doInvitePeople } from '../../../invite/actions.native';
import { showConnectionStatus, showContextMenuDetails } from '../../actions.native';
import { shouldRenderInviteButton } from '../../functions';

import MeetingParticipantItem from './MeetingParticipantItem';
import styles from './styles';

export const MeetingParticipantList = () => {
    const dispatch = useDispatch();
    const items = [];
    const localParticipant = useSelector(getLocalParticipant);
    const onInvite = useCallback(() => dispatch(doInvitePeople()), [ dispatch ]);
    const participants = useSelector(getRemoteParticipants);
    const participantsCount = useSelector(getParticipantCountWithFake);
    const showInviteButton = useSelector(shouldRenderInviteButton);
    const { t } = useTranslation();

    // eslint-disable-next-line react/no-multi-comp
    const renderParticipant = p => (
        <MeetingParticipantItem
            key = { p.id }
            /* eslint-disable-next-line react/jsx-no-bind,no-confusing-arrow */
            onPress = { () => p.local
                ? dispatch(showConnectionStatus(p.id)) : dispatch(showContextMenuDetails(p)) }
            participantID = { p.id } />
    );

    items.push(renderParticipant(localParticipant));

    participants.forEach(p => {
        items.push(renderParticipant(p));
    });

    return (
        <View style = { styles.meetingList }>
            <Text style = { styles.meetingListDescription }>
                {t('participantsPane.headings.participantsList',
                    { count: participantsCount })}
            </Text>
            {
                showInviteButton
                && <Button
                    children = { t('participantsPane.actions.invite') }
                    /* eslint-disable-next-line react/jsx-no-bind */
                    icon = { () =>
                        (<Icon
                            size = { 20 }
                            src = { IconInviteMore } />)
                    }
                    labelStyle = { styles.inviteLabel }
                    mode = 'contained'
                    onPress = { onInvite }
                    style = { styles.inviteButton } />
            }
            { items }
        </View>
    );
};

