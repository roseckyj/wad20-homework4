import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from "moment";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios",  () => ({
    get: ()=> Promise.resolve({
            data: testData,
        })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {
        posts: testData,
        localVue,
        router,
        store
    });

    it('Renders all the posts', async () => {
        let renderedPosts = wrapper.findAll('.post')
        expect(renderedPosts.length).toEqual(testData.length)
    });

    it("Renders media correctly", async() => {
        let renderedPosts = wrapper.findAll('.post')
        for (let i = 0; i < renderedPosts.length; i++) {
            if (renderedPosts[i].media){
                if (renderedPosts[i].media.type == "image"){
                    expect(renderedPosts[i].media.tagName.toLowerCase()).toEqual("img")
                } else{
                    expect(renderedPosts[i].media.tagName.toLowerCase()).toEqual("video")
                }
            } else {
                expect(renderedPosts[i].media).toBeNull()
            }
        }
    })

    it("Formats dates correctly", async() => {
        let renderedPosts = wrapper.findAll('.post')
        for (let i = 0; i < renderedPosts.length; i++){
            expect(testData[i].createTime).toEqual(renderedPosts[i].createTime)
        }
    })
});