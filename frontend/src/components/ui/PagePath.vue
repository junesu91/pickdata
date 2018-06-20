<template>
	<div class="path">
		<p class="path-p"><span v-for="(pathName, index) in pathData.pathName">{{ pathName }}</span></p>
	</div>
</template>

<script>
export default {

	name: 'PagePath',

	props: {
		pathData: {
			type: Object,
			default () {
				return {
					pathName: []
				}
			}
		}
	},

	data() {
		return {

		}
	}
}
</script>

<style lang="scss" scoped>
.path { padding:10px; background:#d9d9d9;
	.path-p {
		span {
			&:after { content:'>'; padding:0 5px; }
				&:last-child { font-weight:bold;
				&:after { content:''; }
			}
		}
	}
}
</style>
