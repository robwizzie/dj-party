import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import usePartyStore from '@/contexts/usePartyStore';

const PartySettings = () => {
	const { isHost, settings, updateSettings } = usePartyStore();

	if (!isHost || !settings) return null;

	const handlePasswordModeChange = value => {
		updateSettings({
			password: {
				...settings.password,
				mode: value,
				enabled: value !== 'open'
			}
		});
	};

	const handlePasswordChange = e => {
		updateSettings({
			password: {
				...settings.password,
				value: e.target.value
			}
		});
	};

	const handleSkipThresholdModeChange = value => {
		updateSettings({
			skipThreshold: {
				...settings.skipThreshold,
				mode: value
			}
		});
	};

	const handleSkipThresholdValueChange = value => {
		updateSettings({
			skipThreshold: {
				...settings.skipThreshold,
				value: parseInt(value[0])
			}
		});
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			<DialogHeader>
				<DialogTitle>Party Settings</DialogTitle>
			</DialogHeader>
			<div className="space-y-6 mt-4">
				{/* Party Password Settings */}
				<div className="space-y-4">
					<Label>Party Access</Label>
					<Select value={settings.password.mode} onValueChange={handlePasswordModeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select access mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="open">Anyone can enter</SelectItem>
							<SelectItem value="password">Require password</SelectItem>
							<SelectItem value="approval">Host approval required</SelectItem>
						</SelectContent>
					</Select>

					{settings.password.mode === 'password' && (
						<Input
							type="password"
							placeholder="Set party password"
							value={settings.password.value}
							onChange={handlePasswordChange}
						/>
					)}
				</div>

				{/* Skip Threshold Settings */}
				<div className="space-y-4">
					<Label>Skip Threshold</Label>
					<Select value={settings.skipThreshold.mode} onValueChange={handleSkipThresholdModeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select skip threshold mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="users">Number of users</SelectItem>
							<SelectItem value="percentage">Percentage of users</SelectItem>
						</SelectContent>
					</Select>

					<Slider
						value={[settings.skipThreshold.value]}
						onValueChange={handleSkipThresholdValueChange}
						max={settings.skipThreshold.mode === 'percentage' ? 100 : 20}
						min={1}
						step={1}
						className="mt-2"
					/>
					<div className="text-sm text-gray-500">
						{settings.skipThreshold.mode === 'percentage'
							? `${settings.skipThreshold.value}% of users required`
							: `${settings.skipThreshold.value} users required`}
					</div>
				</div>

				{/* Replay Limit */}
				<div className="space-y-4">
					<Label>Replay Limit</Label>
					<Slider
						value={[settings.replayLimit]}
						onValueChange={value => updateSettings({ replayLimit: value[0] })}
						max={10}
						min={0}
						step={1}
					/>
					<div className="text-sm text-gray-500">
						{settings.replayLimit === 0 ? 'No replay limit' : `${settings.replayLimit} replays allowed`}
					</div>
				</div>

				{/* Anonymous Voting */}
				<div className="flex items-center justify-between">
					<Label>Anonymous Voting</Label>
					<Switch
						checked={settings.anonymousVoting}
						onCheckedChange={checked => updateSettings({ anonymousVoting: checked })}
					/>
				</div>

				{/* Allow Kicking */}
				<div className="flex items-center justify-between">
					<Label>Allow Kicking Players</Label>
					<Switch
						checked={settings.allowKicking}
						onCheckedChange={checked => updateSettings({ allowKicking: checked })}
					/>
				</div>

				{/* Song Limit */}
				<div className="space-y-4">
					<Label>Song Limit</Label>
					<Slider
						value={[settings.songLimit]}
						onValueChange={value => updateSettings({ songLimit: value[0] })}
						max={50}
						min={0}
						step={1}
					/>
					<div className="text-sm text-gray-500">
						{settings.songLimit === 0 ? 'Unlimited songs allowed' : `${settings.songLimit} songs per user`}
					</div>
				</div>

				{/* Playback Mode */}
				<div className="space-y-4">
					<Label>Playback Mode</Label>
					<Select value={settings.playbackMode} onValueChange={value => updateSettings({ playbackMode: value })}>
						<SelectTrigger>
							<SelectValue placeholder="Select playback mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="host">Through host device</SelectItem>
							<SelectItem value="individual">Individual devices</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};

export default PartySettings;
