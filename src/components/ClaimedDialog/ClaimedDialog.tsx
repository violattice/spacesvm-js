import { Twemoji } from 'react-emoji-render'
import { Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogContent, DialogTitle, styled, Typography } from '@mui/material'

import { rainbowText } from '@/theming/rainbowText'

const SeeItLiveButton = styled(Button)(({ theme }: any) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	height: 80,
	minWidth: 320,
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(82 61 241 / 60%)',
	'&:hover': {
		backgroundColor: '#7a68ff',
		boxShadow: '0 0 40px rgb(82 61 241 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: theme.palette.mode === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.1)',
	},
}))

export const ClaimedDialog = memo(({ spaceId, onClose, ...rest }: any) => (
	<Dialog maxWidth="xs" {...rest}>
		<DialogTitle>
			<Typography
				gutterBottom
				variant="h5"
				component="p"
				fontFamily="DM Serif Display"
				align="center"
				sx={{ position: 'relative' }}
			>
				You have successfully claimed your space!{' '}
				<span style={{ position: 'absolute', fontSize: 36, transform: 'translateX(10px) translateY(-4px)' }}>
					<Twemoji svg text="🥳" />
				</span>
			</Typography>
		</DialogTitle>
		<DialogContent>
			<Typography
				gutterBottom
				variant="h3"
				align="center"
				fontFamily="DM Serif Display"
				sx={{
					...rainbowText,
				}}
			>
				{spaceId}
			</Typography>
			<Box display="flex" justifyContent="center" mt={6}>
				<SeeItLiveButton
					variant="contained"
					size="large"
					fullWidth
					// @ts-ignore
					component={Link}
					to={`/spaces/${spaceId}/`}
				>
					See it live
				</SeeItLiveButton>
			</Box>
		</DialogContent>
	</Dialog>
))
